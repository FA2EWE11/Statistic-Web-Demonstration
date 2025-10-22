import React, { useMemo } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface BasicStatsAnalysisProps {
  data: number[];
  language: 'zh' | 'en';
  translations: {
    [key: string]: string;
  };
}

interface StatisticsResult {
  [key: string]: number | number[];
}

export const BasicStatsAnalysis: React.FC<BasicStatsAnalysisProps> = ({ data, language }) => {
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
    
    // 根据语言返回对应的统计指标名称
    const metricKeys = language === 'zh' ? {
      sampleSize: '样本数量',
      sum: '总和',
      mean: '均值',
      median: '中位数',
      mode: '众数',
      min: '最小值',
      max: '最大值',
      range: '范围',
      q1: '第一四分位数',
      q3: '第三四分位数',
      iqr: '四分位距',
      variance: '方差',
      stdDev: '标准差',
      skewness: '偏度',
      kurtosis: '峰度',
      coefficientOfVariation: '变异系数'
    } : {
      sampleSize: 'Sample Size',
      sum: 'Sum',
      mean: 'Mean',
      median: 'Median',
      mode: 'Mode',
      min: 'Minimum',
      max: 'Maximum',
      range: 'Range',
      q1: 'First Quartile',
      q3: 'Third Quartile',
      iqr: 'Interquartile Range',
      variance: 'Variance',
      stdDev: 'Standard Deviation',
      skewness: 'Skewness',
      kurtosis: 'Kurtosis',
      coefficientOfVariation: 'Coefficient of Variation'
    };

    return {
      [metricKeys.sampleSize]: n,
      [metricKeys.sum]: sum,
      [metricKeys.mean]: mean,
      [metricKeys.median]: median,
      [metricKeys.mode]: mode,
      [metricKeys.min]: min,
      [metricKeys.max]: max,
      [metricKeys.range]: range,
      [metricKeys.q1]: q1,
      [metricKeys.q3]: q3,
      [metricKeys.iqr]: iqr,
      [metricKeys.variance]: variance,
      [metricKeys.stdDev]: stdDev,
      [metricKeys.skewness]: skewness,
      [metricKeys.kurtosis]: kurtosis,
      [metricKeys.coefficientOfVariation]: coefficientOfVariation
    };
  };

  // 使用useMemo缓存计算结果，避免不必要的重新计算
  const stats = useMemo(() => calculateStatistics(data), [data]) as Record<string, number | number[] | undefined>;

  // 格式化数字，处理number或number[]类型
  const formatNumber = (value: number | number[]): string => {
    if (Array.isArray(value)) {
      return value.map(n => n.toFixed(4)).join(', ');
    }
    return value.toFixed(4);
  };

  // 统计指标分组，根据语言返回对应的分组名称和指标列表
  const statGroups = useMemo(() => {
    if (language === 'zh') {
      return {
        '基本统计量': ['样本数量', '总和', '均值', '中位数', '众数'],
        '分布范围': ['最小值', '最大值', '范围', '第一四分位数', '第三四分位数', '四分位距'],
        '变异程度': ['方差', '标准差', '变异系数'],
        '分布形状': ['偏度', '峰度']
      };
    } else {
      return {
        'Basic Statistics': ['Sample Size', 'Sum', 'Mean', 'Median', 'Mode'],
        'Distribution Range': ['Minimum', 'Maximum', 'Range', 'First Quartile', 'Third Quartile', 'Interquartile Range'],
        'Variability Measures': ['Variance', 'Standard Deviation', 'Coefficient of Variation'],
        'Distribution Shape': ['Skewness', 'Kurtosis']
      };
    }
  }, [language]);

  // 如果没有数据，显示提示信息
  if (data.length === 0) {
    const noDataMessage = language === 'zh' ? '请先输入或生成数据以查看统计分析结果' : 'Please input or generate data to view statistical analysis results';
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          {noDataMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'zh' ? '描述性统计分析' : 'Descriptive Statistical Analysis'}
      </Typography>
      
      {/* 数据摘要 */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {language === 'zh' ? '样本数量' : 'Sample Size'}
            </Typography>
            <Typography variant="h4">{stats[language === 'zh' ? '样本数量' : 'Sample Size']}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {language === 'zh' ? '均值' : 'Mean'}
            </Typography>
            <Typography variant="h4">{formatNumber(stats[language === 'zh' ? '均值' : 'Mean'] || 0)}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {language === 'zh' ? '标准差' : 'Standard Deviation'}
            </Typography>
            <Typography variant="h4">{formatNumber(stats[language === 'zh' ? '标准差' : 'Standard Deviation'] || 0)}</Typography>
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
                  <TableCell>{language === 'zh' ? '统计指标' : 'Statistical Indicator'}</TableCell>
                  <TableCell align="right">{language === 'zh' ? '数值' : 'Value'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.map((metric: string) => (
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
          {language === 'zh' ? '数据分布特征分析' : 'Data Distribution Characteristic Analysis'}
        </Typography>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" gutterBottom>
            • {language === 'zh' ? '偏度' : 'Skewness'}: {stats[language === 'zh' ? '偏度' : 'Skewness'] !== undefined && typeof stats[language === 'zh' ? '偏度' : 'Skewness'] === 'number' ? (
              <>数据{language === 'zh' ? (
                  (typeof stats.skewness === 'number' && Math.abs(stats.skewness) < 0.5) ? '近似对称' : 
                 (typeof stats.skewness === 'number' && stats.skewness > 0) ? '右偏（正偏）' : '左偏（负偏）'
                ) : (
                  (typeof stats.skewness === 'number' && Math.abs(stats.skewness) < 0.5) ? 'approximately symmetric' : 
                 (typeof stats.skewness === 'number' && stats.skewness > 0) ? 'right-skewed (positive)' : 'left-skewed (negative)'
                )}</>
            ) : '-'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            • {language === 'zh' ? '峰度' : 'Kurtosis'}: {stats[language === 'zh' ? '峰度' : 'Kurtosis'] !== undefined && typeof stats[language === 'zh' ? '峰度' : 'Kurtosis'] === 'number' ? (
              <>数据分布{language === 'zh' ? (
                (typeof stats.kurtosis === 'number' && stats.kurtosis > 0) ? '尖峰' : '平峰'
              ) : (
                (typeof stats.kurtosis === 'number' && stats.kurtosis > 0) ? 'leptokurtic' : 'platykurtic'
              )}</>
            ) : '-'}
          </Typography>
          <Typography variant="body2">
            • {language === 'zh' ? '变异程度' : 'Variability'}: {stats[language === 'zh' ? '变异系数' : 'Coefficient of Variation'] !== undefined && typeof stats[language === 'zh' ? '变异系数' : 'Coefficient of Variation'] === 'number' ? (
              <>{language === 'zh' ? '变异系数为' : 'Coefficient of variation is'}{formatNumber(stats[language === 'zh' ? '变异系数' : 'Coefficient of Variation'] || 0)}{(typeof stats.coefficientOfVariation === 'number' && stats.coefficientOfVariation < 0.1) ? (language === 'zh' ? '，变异较小' : ', low variability') : ''}</>
            ) : '-'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};