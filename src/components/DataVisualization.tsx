import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Scatter,
  ReferenceLine, ReferenceArea, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend
} from 'recharts';
import { DashScopeConfig } from './dataAnalysis/DashScopeConfig';

interface DataVisualizationProps {
  data: number[];
}

type ChartType = 'histogram' | 'boxplot' | 'scatter' | 'density' | 'line' | 'pie' | 'radar';
type LineDisplayOption = 'normal' | 'movingAverage' | 'both';

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('histogram');
  const [binCount, setBinCount] = useState<number>(10);
  const [smoothing, setSmoothing] = useState<number>(1);
  const [lineInterpolation, setLineInterpolation] = useState<'monotone' | 'linear' | 'stepBefore' | 'stepAfter'>('monotone');
  const [pieCategoryCount, setPieCategoryCount] = useState<number>(5);
  const [lineDisplayOption, setLineDisplayOption] = useState<LineDisplayOption>('both');
  const [dashscopeApiKey, setDashscopeApiKey] = useState<string>('');
  
  // 从localStorage加载保存的API Key
  React.useEffect(() => {
    const savedKey = localStorage.getItem('dashscopeApiKey');
    if (savedKey) {
      setDashscopeApiKey(savedKey);
    }
  }, []);
  
  const handleApiKeyChange = (key: string) => {
    setDashscopeApiKey(key);
    if (key) {
      localStorage.setItem('dashscopeApiKey', key);
    } else {
      localStorage.removeItem('dashscopeApiKey');
    }
  };

  // 生成散点图数据（带索引）
  const generateScatterData = () => {
    return data.map((value, index) => ({ index, value }));
  };

  // 生成饼图数据（按区间分类）
  const generatePieData = () => {
    if (data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => a - b);
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    const range = max - min;
    const binWidth = range / pieCategoryCount;
    
    const categories = new Array(pieCategoryCount).fill(0);
    const labels = [];
    
    // 创建标签
    for (let i = 0; i < pieCategoryCount; i++) {
      const lower = min + i * binWidth;
      const upper = min + (i + 1) * binWidth;
      labels.push(`${lower.toFixed(1)}-${upper.toFixed(1)}`);
    }
    
    // 计算每个区间的数据点数量
    data.forEach(value => {
      // 处理边界情况
      if (value === max) {
        categories[pieCategoryCount - 1]++;
      } else {
        const binIndex = Math.floor((value - min) / binWidth);
        if (binIndex >= 0 && binIndex < pieCategoryCount) {
          categories[binIndex]++;
        }
      }
    });
    
    // 过滤掉没有数据的区间
    return labels
      .map((label, index) => ({
        name: label,
        value: categories[index],
        percentage: data.length > 0 ? (categories[index] / data.length * 100) : 0
      }))
      .filter(item => item.value > 0);
  };

  // 生成雷达图数据（基于数据的统计特征）
  const generateRadarData = () => {
    if (data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    // 计算四分位数
    const getQuantile = (q: number) => {
      const index = q * (data.length - 1);
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const weight = index - lowerIndex;
      return sortedData[lowerIndex] * (1 - weight) + sortedData[upperIndex] * weight;
    };
    
    const q1 = getQuantile(0.25);
    const median = getQuantile(0.5);
    const q3 = getQuantile(0.75);
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    
    // 归一化数据以便在雷达图上显示
    const maxValue = Math.max(Math.abs(min), Math.abs(max));
    
    return [{
      subject: '最小值',
      A: Math.abs(min) / maxValue,
      fullMark: 1
    }, {
      subject: '第一四分位数',
      A: Math.abs(q1) / maxValue,
      fullMark: 1
    }, {
      subject: '中位数',
      A: Math.abs(median) / maxValue,
      fullMark: 1
    }, {
      subject: '均值',
      A: Math.abs(mean) / maxValue,
      fullMark: 1
    }, {
      subject: '第三四分位数',
      A: Math.abs(q3) / maxValue,
      fullMark: 1
    }, {
      subject: '最大值',
      A: Math.abs(max) / maxValue,
      fullMark: 1
    }];
  };

  // 生成折线图数据
  const generateLineData = () => {
    return data.map((value, index) => ({
      index,
      value,
      // 计算移动平均
      movingAverage: index >= 4 ? 
        (data[index-4] + data[index-3] + data[index-2] + data[index-1] + value) / 5 : 
        null
    }));
  };

  // 定义饼图颜色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

  // 生成密度估计数据
  const generateDensityData = () => {
    if (data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => a - b);
    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];
    const range = max - min;
    const bandwidth = range / 20 * smoothing;
    
    const points = [];
    const numPoints = 100;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = min + (range * i) / numPoints;
      let density = 0;
      
      for (const d of data) {
        const kernel = (1 / Math.sqrt(2 * Math.PI * bandwidth * bandwidth)) * 
                      Math.exp(-0.5 * Math.pow((x - d) / bandwidth, 2));
        density += kernel;
      }
      
      density /= data.length;
      points.push({ x, density });
    }
    
    return points;
  };

  // 计算直方图数据
  const calculateHistogram = (values: number[], bins: number): { bins: number[]; frequencies: number[] } => {
    if (values.length === 0) return { bins: [], frequencies: [] };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const frequencies = new Array(bins).fill(0);
    const binEdges = Array.from({ length: bins + 1 }, (_, i) => min + i * binWidth);
    
    values.forEach(value => {
      // 处理边界情况
      if (value === max) {
        frequencies[bins - 1]++;
      } else {
        const binIndex = Math.floor((value - min) / binWidth);
        if (binIndex >= 0 && binIndex < bins) {
          frequencies[binIndex]++;
        }
      }
    });
    
    // 计算每个bin的中点作为显示
    const binMidpoints = binEdges.slice(0, -1).map(edge => edge + binWidth / 2);
    
    return { bins: binMidpoints, frequencies };
  };

  // 计算箱线图数据
  const calculateBoxplot = (values: number[]): {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
  } => {
    if (values.length === 0) {
      return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
    }

    const sortedData = [...values].sort((a, b) => a - b);
    const n = sortedData.length;
    
    // 计算四分位数
    const getQuantile = (q: number) => {
      const index = q * (n - 1);
      const lowerIndex = Math.floor(index);
      const upperIndex = Math.ceil(index);
      const weight = index - lowerIndex;
      return sortedData[lowerIndex] * (1 - weight) + sortedData[upperIndex] * weight;
    };
    
    const q1 = getQuantile(0.25);
    const median = getQuantile(0.5);
    const q3 = getQuantile(0.75);
    const iqr = q3 - q1;
    
    // 识别异常值
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = sortedData.filter(value => value < lowerBound || value > upperBound);
    
    // 计算非异常值的最小值和最大值
    const filteredData = sortedData.filter(value => value >= lowerBound && value <= upperBound);
    const min = filteredData[0];
    const max = filteredData[filteredData.length - 1];
    
    return { min, q1, median, q3, max, outliers };
  };

  // 生成折线图
  const renderLineChart = () => {
    const lineData = generateLineData();
    
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="index" 
              label={{ value: '数据索引', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: '数据值', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              formatter={(value: any) => value !== null ? [typeof value === 'number' ? value.toFixed(2) : String(value), ''] : ['无数据', '']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend verticalAlign="top" height={36} />
            {(lineDisplayOption === 'normal' || lineDisplayOption === 'both') && (
              <Line 
                type={lineInterpolation} 
                dataKey="value" 
                stroke="#646cff" 
                strokeWidth={2} 
                dot={{ fill: '#646cff', strokeWidth: 1, r: 3 }}
                activeDot={{ r: 6, stroke: '#4338ca', strokeWidth: 2 }}
                name="数据值"
                animationDuration={1000}
              />
            )}
            {(lineDisplayOption === 'movingAverage' || lineDisplayOption === 'both') && (
              <Line 
                type={lineInterpolation} 
                dataKey="movingAverage" 
                stroke="#ff4560" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                name="5点移动平均"
                animationDuration={1000}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 生成饼图
  const renderPieChart = () => {
    const pieData = generatePieData();
    
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
            >
              {pieData.map((_, index) => (  
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, _, props) => [`${value} (${Math.round(props.payload.percentage)}%)`, '数量']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend verticalAlign="bottom" height={36} layout="horizontal" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 生成雷达图
  const renderRadarChart = () => {
    const radarData = generateRadarData();
    
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fontSize: 10 }} />
            <Radar
              name="数据分布"
              dataKey="A"
              stroke="#646cff"
              fill="#646cff"
              fillOpacity={0.5}
              animationDuration={1500}
            />
            <Tooltip 
              formatter={(value) => [`${((value as number) * 100).toFixed(1)}%`, '相对比例']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 生成Recharts直方图
  const renderHistogram = () => {
    const { bins, frequencies } = calculateHistogram(data, binCount);
    if (bins.length === 0) return null;

    const histogramData = bins.map((bin, index) => ({
      bin: bin.toFixed(2),
      frequency: frequencies[index],
      value: bin
    }));

    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="bin" 
              label={{ value: '数据值', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: '频率', angle: -90, position: 'left' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}`, '频率']}
              labelFormatter={(label) => `数值: ${label}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="frequency" 
              fill="#646cff" 
              name="频率"
              radius={[4, 4, 0, 0]}
              animationDuration={800}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 生成Recharts箱线图
  const renderBoxplot = () => {
    const { min, q1, median, q3, max, outliers } = calculateBoxplot(data);
    const boxplotData = [{ name: '数据分布', min, q1, median, q3, max }];
    const scatterData = outliers.map((value, index) => ({ 
      name: `异常值${index + 1}`, 
      value, 
      x: 0.5 + (index % 5) * 0.1 // 分散异常值显示
    }));

    // 计算数据范围
    const allValues = [...data];
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    const padding = (dataMax - dataMin) * 0.1;

    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={boxplotData}
            margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              tick={{ fontSize: 14 }}
            />
            <YAxis 
              domain={[dataMin - padding, dataMax + padding]}
              label={{ value: '数据值', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* 须线 */}
            <Line 
              type="monotone" 
              dataKey="min" 
              stroke="#000000" 
              strokeWidth={2} 
              hide={true}
            />
            <Line 
              type="monotone" 
              dataKey="max" 
              stroke="#000000" 
              strokeWidth={2} 
              hide={true}
            />
            
            {/* 箱体 */}
            <ReferenceArea 
              y1={q1} 
              y2={q3} 
              x1="数据分布" 
              x2="数据分布" 
              fill="#646cff" 
              opacity={0.7} 
              stroke="#4338ca"
            />
            
            {/* 中位数线 */}
            <ReferenceLine 
              y={median} 
              stroke="#020617" 
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            
            {/* 异常值 */}
            {scatterData.length > 0 && (
              <Scatter 
              data={scatterData} 
              name="异常值"
              fill="#ef4444" 
              shape="circle"
            />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 生成散点图
  const renderScatterPlot = () => {
    const scatterData = generateScatterData();
    
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
              margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              type="number" 
              dataKey="index" 
              name="索引" 
              label={{ value: '数据索引', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              type="number" 
              dataKey="value" 
              name="值" 
              label={{ value: '数据值', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any, name: string) => [`${typeof value === 'number' ? value.toFixed(2) : String(value)}`, name === 'index' ? '索引' : '值']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Scatter 
              name="数据点" 
              data={scatterData} 
              fill="#646cff"
              shape="circle"
              opacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 生成密度图
  const renderDensityPlot = () => {
    const densityData = generateDensityData();
    
    return (
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={densityData}
            margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="x" 
              label={{ value: '数据值', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: '密度', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}`, '密度']}
              labelFormatter={(label) => `数值: ${parseFloat(label).toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="density" 
              stroke="#646cff" 
              strokeWidth={2} 
              dot={false}
              name="密度"
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          请先输入或生成数据以查看可视化结果
        </Typography>
      </Box>
    );
  }

  return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        {/* DashScope API配置 */}
        <DashScopeConfig 
          onApiKeyChange={handleApiKeyChange} 
          currentApiKey={dashscopeApiKey}
        />
        
        <Typography variant="h6" gutterBottom className="text-slate-800 font-semibold">
          数据可视化
        </Typography>
        
        {/* 样本容量信息 */}
        <Typography variant="body2" color="text.secondary" className="mb-4">
          当前数据样本容量: <span className="font-medium">{data.length.toLocaleString()}</span> 个数据点
        </Typography>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">图表类型</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="histogram">直方图</option>
            <option value="boxplot">箱线图</option>
            <option value="scatter">散点图</option>
            <option value="density">密度图</option>
            <option value="line">折线图</option>
            <option value="pie">饼图</option>
            <option value="radar">雷达图</option>
            </select>
          </div>
          
          {chartType === 'histogram' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">分箱数量: {binCount}</label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={binCount}
                onChange={(e) => setBinCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
          
          {chartType === 'density' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">平滑度: {smoothing.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={smoothing}
                onChange={(e) => setSmoothing(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
          
          {chartType === 'line' && (
            <>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-700 mb-1">曲线类型</label>
                <select
                  value={lineInterpolation}
                  onChange={(e) => setLineInterpolation(e.target.value as typeof lineInterpolation)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monotone">平滑曲线</option>
                  <option value="linear">直线</option>
                  <option value="stepBefore">阶梯前</option>
                  <option value="stepAfter">阶梯后</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-700 mb-1">显示选项</label>
                <select
                  value={lineDisplayOption}
                  onChange={(e) => setLineDisplayOption(e.target.value as LineDisplayOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="normal">原始数据</option>
                  <option value="movingAverage">移动平均</option>
                  <option value="both">两者都显示</option>
                </select>
              </div>
            </>
          )}
          
          {chartType === 'pie' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">分类数量: {pieCategoryCount}</label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={pieCategoryCount}
                onChange={(e) => setPieCategoryCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          {chartType === 'histogram' && renderHistogram()}
          {chartType === 'boxplot' && renderBoxplot()}
          {chartType === 'scatter' && renderScatterPlot()}
          {chartType === 'density' && renderDensityPlot()}
          {chartType === 'line' && renderLineChart()}
          {chartType === 'pie' && renderPieChart()}
          {chartType === 'radar' && renderRadarChart()}
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-gray-100">
          <Typography variant="subtitle1" gutterBottom className="font-semibold text-slate-700">
            可视化说明
          </Typography>
          <Typography variant="body2" className="text-slate-600">
            {chartType === 'histogram' ? (
              <>
                直方图展示了数据的分布情况，每个柱子代表一个数值区间（分箱），柱子的高度表示落在该区间内的数据点数量。
                通过调整分箱数量，可以观察数据分布的不同细节。
              </>
            ) : chartType === 'boxplot' ? (
              <>
                箱线图显示了数据的五数概括：最小值、第一四分位数（Q1）、中位数、第三四分位数（Q3）和最大值。
                箱体的上下边界分别代表Q1和Q3，箱体内部的横线代表中位数。
                箱体外部的线段（须线）延伸到最小值和最大值。
                红色圆点表示异常值（超出Q1-1.5×IQR或Q3+1.5×IQR范围的数据点）。
              </>
            ) : chartType === 'scatter' ? (
              <>
                散点图展示了每个数据点的原始位置，横轴表示数据索引，纵轴表示数据值。
                这种可视化方式有助于观察数据的趋势和分布模式。
              </>
            ) : chartType === 'density' ? (
              <>
                密度图显示了数据的概率密度分布，基于核密度估计方法生成。
                曲线的高度表示数据在该值附近出现的相对频率。
                通过调整平滑度参数，可以控制曲线的平滑程度。
              </>
            ) : chartType === 'line' ? (
              <>
                折线图展示了数据点的时间序列或顺序关系，连接相邻的数据点。
                图表还显示了5点移动平均线，有助于观察数据的趋势变化。
                可以通过选择不同的曲线类型（平滑、直线、阶梯）来改变线条的连接方式。
              </>
            ) : chartType === 'pie' ? (
              <>
                饼图将数据按照数值范围分成若干类别，每个扇形的大小表示该类别中数据点的数量占比。
                可以通过调整分类数量来控制数据分组的精细程度。
                每个扇形的颜色不同，便于区分不同的类别。
              </>
            ) : (
              <>
                雷达图（星形图）展示了数据分布的统计特征，包括最小值、第一四分位数、中位数、均值、第三四分位数和最大值。
                雷达图的每个轴代表一个统计量，数值经过归一化处理，便于直观比较不同统计量之间的关系。
                图表使用多边形区域来表示数据的整体分布特征。
              </>
            )}
          </Typography>
        </div>
      </div>
  );
};