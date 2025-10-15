import React, { useMemo } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface BasicStatsAnalysisProps {
  data: number[];
}

interface StatisticsResult {
  [key: string]: number | number[];
}

export const BasicStatsAnalysis: React.FC<BasicStatsAnalysisProps> = ({ data }) => {
  // 计算描述性统计
  const calculateStatistics = (values: number[]): StatisticsResult => {
    if (values.length === 0) {
      return {};
    }

    // 排序数组用于计算中位数等
    const sortedData = [...values].sort((a, b) => a - b);
    const n = values.length;
    
    // 计算总和
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    // 计算均值
    const mean = sum / n;
    
    // 计算中位数
    let median: number;
    if (n % 2 === 0) {
      median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    } else {
      median = sortedData[Math.floor(n / 2)];
    }
    
    // 计算众数
    let mode: number | number[] = 0;
    const frequencyMap = new Map<number, number>();
    let maxFrequency = 0;
    values.forEach(val => {
      const freq = (frequencyMap.get(val) || 0) + 1;
      frequencyMap.set(val, freq);
      maxFrequency = Math.max(maxFrequency, freq);
    });
    
    const modes: number[] = [];
    frequencyMap.forEach((freq, val) => {
      if (freq === maxFrequency) {
        modes.push(val);
      }
    });
    
    // 如果只有一个众数，返回单个值，否则返回数组
    mode = modes.length === 1 ? modes[0] : modes;
    
    // 计算最小值和最大值
    const min = sortedData[0];
    const max = sortedData[n - 1];
    
    // 计算范围
    const range = max - min;
    
    // 计算四分位数
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sortedData[q1Index];
    const q3 = sortedData[q3Index];
    
    // 计算四分位距
    const iqr = q3 - q1;
    
    // 计算方差
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    
    // 计算标准差
    const stdDev = Math.sqrt(variance);
    
    // 计算偏度
    const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
    
    // 计算峰度
    const kurtosis = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
    
    // 计算变异系数
    const coefficientOfVariation = stdDev / Math.abs(mean);
    
    return {
      样本数量: n,
      总和: sum,
      均值: mean,
      中位数: median,
      众数: mode,
      最小值: min,
      最大值: max,
      范围: range,
      第一四分位数: q1,
      第三四分位数: q3,
      四分位距: iqr,
      方差: variance,
      标准差: stdDev,
      偏度: skewness,
      峰度: kurtosis,
      变异系数: coefficientOfVariation
    };
  };

  // 使用useMemo缓存计算结果，避免不必要的重新计算
  const stats = useMemo(() => calculateStatistics(data), [data]);

  // 格式化数字，处理number或number[]类型
  const formatNumber = (value: number | number[]): string => {
    if (Array.isArray(value)) {
      return value.map(n => n.toFixed(4)).join(', ');
    }
    return value.toFixed(4);
  };

  // 统计指标分组
  const statGroups = useMemo(() => {
    return {
      '基本统计量': ['样本数量', '总和', '均值', '中位数', '众数'],
      '分布范围': ['最小值', '最大值', '范围', '第一四分位数', '第三四分位数', '四分位距'],
      '变异程度': ['方差', '标准差', '变异系数'],
      '分布形状': ['偏度', '峰度']
    };
  }, []);

  // 如果没有数据，显示提示信息
  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          请先输入或生成数据以查看统计分析结果
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        描述性统计分析
      </Typography>
      
      {/* 数据摘要 */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              样本数量
            </Typography>
            <Typography variant="h4">{stats['样本数量']}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              均值
            </Typography>
            <Typography variant="h4">{formatNumber(stats['均值'])}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              标准差
            </Typography>
            <Typography variant="h4">{formatNumber(stats['标准差'])}</Typography>
          </Paper>
        </Box>
      </Box>

      {/* 详细统计表格 */}
      {Object.entries(statGroups).map(([groupName, metrics]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {groupName}
          </Typography>
          <TableContainer component={Paper} elevation={1}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>统计指标</TableCell>
                  <TableCell align="right">数值</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.map(metric => (
                  <TableRow key={metric}>
                    <TableCell component="th" scope="row">
                      {metric}
                    </TableCell>
                    <TableCell align="right">
                      {stats[metric] !== undefined ? formatNumber(stats[metric]) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* 数据分布描述 */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: '#fafafa', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          数据分布特征分析
        </Typography>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" gutterBottom>
            • 偏度: {stats['偏度'] !== undefined && typeof stats['偏度'] === 'number' ? (
              <>数据{Math.abs(stats['偏度']) < 0.5 ? '近似对称' : 
                     stats['偏度'] > 0 ? '右偏（正偏）' : '左偏（负偏）'}</>
            ) : '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            • 峰度: {stats['峰度'] !== undefined && typeof stats['峰度'] === 'number' ? (
              <>数据分布{stats['峰度'] > 0 ? '尖峰' : '平峰'}</>
            ) : '-'}

          </Typography>
          <Typography variant="body2">
            • 变异程度: {stats['变异系数'] !== undefined && typeof stats['变异系数'] === 'number' ? (
              <>变异系数为{formatNumber(stats['变异系数'])}{stats['变异系数'] < 0.1 ? '，变异较小' : ''}</>
            ) : '-'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};