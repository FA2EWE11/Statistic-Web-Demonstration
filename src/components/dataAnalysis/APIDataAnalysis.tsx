import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Divider, Chip } from '@mui/material';

interface APIDataAnalysisProps {
  data: number[];
  language: 'zh' | 'en';
  translations: {
    [key: string]: string;
  };
}

// 数据分析结果接口
interface AnalysisResult {
  dataFeatures: string[];
  dataSource: string;
  researchDirections: string[];
}

export const APIDataAnalysis: React.FC<APIDataAnalysisProps> = ({ data, language }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 分析数据
  useEffect(() => {
    if (data.length > 0) {
      performAnalysis();
    } else {
      setAnalysisResult(null);
    }
  }, [data, language]);

  // 执行数据分析（使用模拟数据，因为实际API调用可能受限）
  const performAnalysis = () => {
    setLoading(true);
    setError(null);

    // 模拟API延迟
    setTimeout(() => {
      try {
        // 计算基本统计量用于分析
        const n = data.length;
        const mean = data.reduce((sum, val) => sum + val, 0) / n;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
        const std = Math.sqrt(variance);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        // 计算偏度和峰度
        const skewness = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) / n;
        const kurtosis = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 4), 0) / n - 3;

        // 根据统计量生成分析结果
        const result = generateAnalysisResult({
          mean,
          std,
          min,
          max,
          range,
          skewness,
          kurtosis,
          n
        });

        setAnalysisResult(result);
      } catch (err) {
        setError(language === 'zh' ? '数据分析失败' : 'Data analysis failed');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // 生成分析结果
  const generateAnalysisResult = (stats: {
    mean: number;
    std: number;
    min: number;
    max: number;
    range: number;
    skewness: number;
    kurtosis: number;
    n: number;
  }): AnalysisResult => {
    const { mean, std, skewness, kurtosis, min, max } = stats;
    const dataFeatures: string[] = [];
    const researchDirections: string[] = [];
    let dataSource = '';

    // 数据特征分析
    if (language === 'zh') {
      // 分布形态
      if (Math.abs(skewness) < 0.5) {
        dataFeatures.push('数据分布近似对称，符合正态分布特征');
      } else if (skewness > 0.5) {
        dataFeatures.push('数据呈右偏分布，存在少量较大值');
      } else {
        dataFeatures.push('数据呈左偏分布，存在少量较小值');
      }

      // 峰度分析
      if (Math.abs(kurtosis) < 0.5) {
        dataFeatures.push('数据峰度接近正态分布');
      } else if (kurtosis > 0.5) {
        dataFeatures.push('数据呈现高峰态，中间值集中');
      } else {
        dataFeatures.push('数据呈现低峰态，分布较为分散');
      }

      // 变异程度
      const cv = std / Math.abs(mean); // 变异系数
      if (cv < 0.1) {
        dataFeatures.push('数据变异程度很小，一致性高');
      } else if (cv < 0.5) {
        dataFeatures.push('数据变异程度适中');
      } else {
        dataFeatures.push('数据变异程度较大，离散性强');
      }

      // 数据范围
      if (min >= 0 && max <= 1) {
        dataFeatures.push('数据范围在0-1之间，可能是比例数据');
      } else if (min >= 0 && Number.isInteger(min) && Number.isInteger(max) && max < 100) {
        dataFeatures.push('数据为非负整数且范围较小，可能是计数数据');
      } else if (mean > 0 && mean < 10 && std < mean) {
        dataFeatures.push('数据均值和标准差适中，可能是测量数据');
      }

      // 推测数据来源
      if (min >= 0 && max <= 1) {
        dataSource = '这些数据可能来源于概率、比例或标准化后的测量结果，如市场份额、投资回报率或归一化的测试分数。';
      } else if (Number.isInteger(min) && Number.isInteger(max) && min >= 0) {
        dataSource = '这些数据可能来源于计数过程，如用户访问量、产品销量、事件发生次数或质量控制中的缺陷数量。';
      } else if (Math.abs(mean) > 100) {
        dataSource = '这些数据可能来源于金融指标、人口统计数据或物理测量，如股票价格、收入水平或温度测量。';
      } else {
        dataSource = '这些数据可能来源于科学实验、调查研究或业务分析中的连续变量测量，如时间、长度、重量或满意度评分。';
      }

      // 研究方向建议
      researchDirections.push('1. 进行假设检验，验证数据是否符合特定的理论分布');
      researchDirections.push('2. 应用回归分析，探索这些数据与其他变量的关系');
      researchDirections.push('3. 进行时间序列分析（如果数据有时间维度）');
      researchDirections.push('4. 应用聚类分析，识别数据中的自然分组');
      researchDirections.push('5. 进行异常值检测，识别潜在的异常数据点');
    } else {
      // 英文版本分析
      if (Math.abs(skewness) < 0.5) {
        dataFeatures.push('Data distribution is approximately symmetric, consistent with normal distribution');
      } else if (skewness > 0.5) {
        dataFeatures.push('Data shows right-skewed distribution with a few larger values');
      } else {
        dataFeatures.push('Data shows left-skewed distribution with a few smaller values');
      }

      if (Math.abs(kurtosis) < 0.5) {
        dataFeatures.push('Data kurtosis is close to normal distribution');
      } else if (kurtosis > 0.5) {
        dataFeatures.push('Data shows leptokurtic distribution, with values concentrated in the middle');
      } else {
        dataFeatures.push('Data shows platykurtic distribution, with values relatively dispersed');
      }

      const cv = std / Math.abs(mean);
      if (cv < 0.1) {
        dataFeatures.push('Data shows very low variability, high consistency');
      } else if (cv < 0.5) {
        dataFeatures.push('Data shows moderate variability');
      } else {
        dataFeatures.push('Data shows high variability, strong dispersion');
      }

      if (min >= 0 && max <= 1) {
        dataFeatures.push('Data ranges between 0-1, possibly proportional data');
      } else if (min >= 0 && Number.isInteger(min) && Number.isInteger(max) && max < 100) {
        dataFeatures.push('Data is non-negative integer with small range, possibly count data');
      } else if (mean > 0 && mean < 10 && std < mean) {
        dataFeatures.push('Data has moderate mean and standard deviation, possibly measurement data');
      }

      // English data source guess
      if (min >= 0 && max <= 1) {
        dataSource = 'These data may come from probabilities, proportions, or normalized measurements, such as market share, investment returns, or normalized test scores.';
      } else if (Number.isInteger(min) && Number.isInteger(max) && min >= 0) {
        dataSource = 'These data may come from counting processes, such as user visits, product sales, event occurrences, or defect counts in quality control.';
      } else if (Math.abs(mean) > 100) {
        dataSource = 'These data may come from financial indicators, demographic data, or physical measurements, such as stock prices, income levels, or temperature measurements.';
      } else {
        dataSource = 'These data may come from scientific experiments, survey research, or business analysis continuous variable measurements, such as time, length, weight, or satisfaction scores.';
      }

      // English research directions
      researchDirections.push('1. Conduct hypothesis testing to verify if the data fits specific theoretical distributions');
      researchDirections.push('2. Apply regression analysis to explore relationships between these data and other variables');
      researchDirections.push('3. Perform time series analysis (if the data has a time dimension)');
      researchDirections.push('4. Apply cluster analysis to identify natural groupings in the data');
      researchDirections.push('5. Conduct outlier detection to identify potential anomalous data points');
    }

    return {
      dataFeatures,
      dataSource,
      researchDirections
    };
  };

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          {language === 'zh' ? '请先输入或生成数据以查看AI分析结果' : 'Please input or generate data to view AI analysis results'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {language === 'zh' ? 'AI数据深度分析' : 'AI Data Deep Analysis'}
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {analysisResult && !loading && (
        <Box sx={{ mt: 2, gap: 3, display: 'flex', flexDirection: 'column' }}>
          {/* 数据特征分析 */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              {language === 'zh' ? '数据特征分析' : 'Data Feature Analysis'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {analysisResult.dataFeatures.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  sx={{ alignSelf: 'flex-start', mb: 1 }}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Paper>

          {/* 数据来源推测 */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              {language === 'zh' ? '数据来源推测' : 'Data Source Inference'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {analysisResult.dataSource}
            </Typography>
          </Paper>

          {/* 研究方向建议 */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              {language === 'zh' ? '研究方向建议' : 'Research Direction Suggestions'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box component="ul" sx={{ pl: 2, listStyleType: 'none' }}>
              {analysisResult.researchDirections.map((direction, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  <Typography variant="body1">{direction}</Typography>
                </li>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};