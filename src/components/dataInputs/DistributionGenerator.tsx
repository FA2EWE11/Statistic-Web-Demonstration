import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography } from '@mui/material';

interface Translations {
  distributionGeneration: string;
  selectDistribution: string;
  normal: string;
  uniform: string;
  exponential: string;
  poisson: string;
  binomial: string;
  gamma: string;
  beta: string;
  sampleSize: string;
  mean: string;
  stdDev: string;
  min: string;
  max: string;
  rate: string;
  lambda: string;
  trials: string;
  probability: string;
  shape: string;
  scale: string;
  alpha: string;
  betaParam: string;
  generateData: string;
  generating: string;
  stdDevHelper: string;
  rateHelper: string;
  lambdaHelper: string;
  trialsHelper: string;
  probabilityHelper: string;
  shapeHelper: string;
  scaleHelper: string;
  alphaHelper: string;
  betaParamHelper: string;
  normalParamsTitle: string;
  uniformParamsTitle: string;
  exponentialParamsTitle: string;
  poissonParamsTitle: string;
  binomialParamsTitle: string;
  gammaParamsTitle: string;
  betaParamsTitle: string;
}

interface DistributionGeneratorProps {
  onDataChange: (data: number[]) => void;
  onError: (error: string) => void;
  language?: 'zh' | 'en';
  translations?: Translations;
}

// 支持的分布类型
type DistributionType = 'normal' | 'uniform' | 'exponential' | 'poisson' | 'binomial' | 'gamma' | 'beta';

export const DistributionGenerator: React.FC<DistributionGeneratorProps> = ({
  onDataChange,
  onError,
  language = 'zh',
  translations = {
    distributionGeneration: '分布数据生成器',
    selectDistribution: '分布类型',
    normal: '正态分布',
    uniform: '均匀分布',
    exponential: '指数分布',
    poisson: '泊松分布',
    binomial: '二项分布',
    gamma: '伽马分布',
    beta: '贝塔分布',
    sampleSize: '样本大小 (10-1000)',
    mean: '均值 (μ)',
    stdDev: '标准差 (σ)',
    min: '最小值',
    max: '最大值',
    rate: 'λ参数',
    lambda: '速率参数 (λ)',
    trials: '试验次数',
    probability: '成功概率',
    shape: '形状参数 (k)',
    scale: '尺度参数 (θ)',
    alpha: 'α参数',
    betaParam: 'β参数',
    generateData: '生成数据',
    generating: '生成中...',
    stdDevHelper: '标准差必须大于0',
    rateHelper: 'λ参数必须大于0',
    lambdaHelper: '速率参数必须大于0',
    trialsHelper: '试验次数必须大于0',
    probabilityHelper: '概率必须在0到1之间',
    shapeHelper: '形状参数必须大于0',
    scaleHelper: '尺度参数必须大于0',
    alphaHelper: 'α参数必须大于0',
    betaParamHelper: 'β参数必须大于0',
    normalParamsTitle: '正态分布参数',
    uniformParamsTitle: '均匀分布参数',
    exponentialParamsTitle: '指数分布参数',
    poissonParamsTitle: '泊松分布参数',
    binomialParamsTitle: '二项分布参数',
    gammaParamsTitle: '伽马分布参数',
    betaParamsTitle: '贝塔分布参数'
  }
}) => {
  const [distribution, setDistribution] = useState<DistributionType>('normal');
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [params, setParams] = useState({
    mean: 0,
    std: 1,
    min: 0,
    max: 1,
    lambda: 1,
    rate: 1,
    trials: 10,
    probability: 0.5,
    shape: 2,
    scale: 1,
    alpha: 2,
    beta: 2
  });

  // 生成正态分布数据
  const generateNormalData = (mean: number, std: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      // 使用Box-Muller变换生成正态分布随机数
      let u1 = 0, u2 = 0;
      while (u1 === 0) u1 = Math.random();
      while (u2 === 0) u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      data.push(z0 * std + mean);
    }
    return data;
  };

  // 生成均匀分布数据
  const generateUniformData = (min: number, max: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      data.push(Math.random() * (max - min) + min);
    }
    return data;
  };

  // 生成指数分布数据
  const generateExponentialData = (lambda: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      const u = Math.random();
      data.push(-Math.log(1 - u) / lambda);
    }
    return data;
  };

  // 生成泊松分布数据
  const generatePoissonData = (rate: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      let k = 0;
      let p = 1;
      const L = Math.exp(-rate);
      while (p > L) {
        k++;
        p *= Math.random();
      }
      data.push(k - 1);
    }
    return data;
  };

  // 处理参数变化
  const handleParamChange = (paramName: keyof typeof params, value: number) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // 生成二项分布数据
  const generateBinomialData = (trials: number, probability: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      let successes = 0;
      for (let j = 0; j < trials; j++) {
        if (Math.random() < probability) {
          successes++;
        }
      }
      data.push(successes);
    }
    return data;
  };

  // 生成伽马分布数据
  const generateGammaData = (shape: number, scale: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      // 使用Marsaglia和Tsang方法生成伽马分布随机数
      let d, c, x, v, u;
      d = shape - 1 / 3;
      c = 1 / Math.sqrt(9 * d);
      
      do {
        do {
          x = Math.random();
          v = c * x + 1 - c * x;
        } while (v <= 0);
        
        v = Math.pow(v, 3);
        u = Math.random();
      } while (u >= 1 - 0.0331 * Math.pow(x, 4) && 
               Math.log(u) >= 0.5 * Math.pow(x, 2) + d * (1 - v + Math.log(v)));
      
      data.push(d * v * scale);
    }
    return data;
  };

  // 生成贝塔分布数据
  const generateBetaData = (alpha: number, beta: number, size: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      // 使用两个伽马分布生成贝塔分布
      const x = generateGammaData(alpha, 1, 1)[0];
      const y = generateGammaData(beta, 1, 1)[0];
      data.push(x / (x + y));
    }
    return data;
  };

  // 生成数据
  const generateData = () => {
    try {
      let data: number[] = [];

      if (sampleSize < 10 || sampleSize > 1000) {
        onError('样本大小必须在10到1000之间');
        return;
      }

      switch (distribution) {
        case 'normal':
          if (params.std <= 0) {
            onError('标准差必须大于0');
            return;
          }
          data = generateNormalData(params.mean, params.std, sampleSize);
          break;
        case 'uniform':
          if (params.max <= params.min) {
            onError('最大值必须大于最小值');
            return;
          }
          data = generateUniformData(params.min, params.max, sampleSize);
          break;
        case 'exponential':
          if (params.lambda <= 0) {
            onError('λ参数必须大于0');
            return;
          }
          data = generateExponentialData(params.lambda, sampleSize);
          break;
        case 'poisson':
          if (params.rate <= 0) {
            onError('速率参数必须大于0');
            return;
          }
          data = generatePoissonData(params.rate, sampleSize);
          break;
        case 'binomial':
          if (params.trials <= 0 || params.probability < 0 || params.probability > 1) {
            onError('试验次数必须大于0，概率必须在0到1之间');
            return;
          }
          data = generateBinomialData(params.trials, params.probability, sampleSize);
          break;
        case 'gamma':
          if (params.shape <= 0 || params.scale <= 0) {
            onError('形状参数和尺度参数必须大于0');
            return;
          }
          data = generateGammaData(params.shape, params.scale, sampleSize);
          break;
        case 'beta':
          if (params.alpha <= 0 || params.beta <= 0) {
            onError('α和β参数必须大于0');
            return;
          }
          data = generateBetaData(params.alpha, params.beta, sampleSize);
          break;
      }

      onDataChange(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : '数据生成失败');
    }
  };

  // 渲染参数输入字段
  const renderParamInputs = () => {
    switch (distribution) {
      case 'normal':
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
              <TextField
                fullWidth
                label={translations.mean}
                type="number"
                value={params.mean}
                onChange={(e) => handleParamChange('mean', parseFloat(e.target.value) || 0)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
              <TextField
                fullWidth
                label={translations.stdDev}
                type="number"
                value={params.std}
                onChange={(e) => handleParamChange('std', parseFloat(e.target.value) || 1)}
                variant="outlined"
                helperText={translations.stdDevHelper}
                error={params.std <= 0}
                inputProps={{ min: 0.01 }}
              />
            </Box>
          </Box>
        );
      case 'uniform':
        return (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
              <TextField
                fullWidth
                label={translations.min}
                type="number"
                value={params.min}
                onChange={(e) => handleParamChange('min', parseFloat(e.target.value) || 0)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
              <TextField
                fullWidth
                label={translations.max}
                type="number"
                value={params.max}
                onChange={(e) => handleParamChange('max', parseFloat(e.target.value) || 1)}
                variant="outlined"
                error={params.max <= params.min}
                helperText={language === 'zh' ? "最大值必须大于最小值" : "Maximum value must be greater than minimum value"}
              />
            </Box>
          </Box>
        );
      case 'exponential':
        return (
          <TextField
            fullWidth
            label={translations.rate}
            type="number"
            value={params.lambda}
            onChange={(e) => handleParamChange('lambda', parseFloat(e.target.value) || 1)}
            variant="outlined"
            helperText={translations.rateHelper}
            error={params.lambda <= 0}
            inputProps={{ min: 0.01 }}
          />
        );
      case 'poisson':
          return (
            <TextField
              fullWidth
              label={translations.lambda}
              type="number"
              value={params.rate}
              onChange={(e) => handleParamChange('rate', parseFloat(e.target.value) || 1)}
              variant="outlined"
              helperText={translations.lambdaHelper}
              error={params.rate <= 0}
              inputProps={{ min: 0.01 }}
            />
          );
        case 'binomial':
          return (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.trials}
                  type="number"
                  value={params.trials}
                  onChange={(e) => handleParamChange('trials', parseFloat(e.target.value) || 10)}
                  variant="outlined"
                  helperText={translations.trialsHelper}
                  error={params.trials <= 0}
                  inputProps={{ min: 1 }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.probability}
                  type="number"
                  value={params.probability}
                  onChange={(e) => handleParamChange('probability', parseFloat(e.target.value) || 0.5)}
                  variant="outlined"
                  helperText={translations.probabilityHelper}
                  error={params.probability < 0 || params.probability > 1}
                  inputProps={{ min: 0, max: 1, step: 0.01 }}
                />
              </Box>
            </Box>
          );
        case 'gamma':
          return (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.shape}
                  type="number"
                  value={params.shape}
                  onChange={(e) => handleParamChange('shape', parseFloat(e.target.value) || 2)}
                  variant="outlined"
                  helperText={translations.shapeHelper}
                  error={params.shape <= 0}
                  inputProps={{ min: 0.01 }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.scale}
                  type="number"
                  value={params.scale}
                  onChange={(e) => handleParamChange('scale', parseFloat(e.target.value) || 1)}
                  variant="outlined"
                  helperText={translations.scaleHelper}
                  error={params.scale <= 0}
                  inputProps={{ min: 0.01 }}
                />
              </Box>
            </Box>
          );
        case 'beta':
          return (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.alpha}
                  type="number"
                  value={params.alpha}
                  onChange={(e) => handleParamChange('alpha', parseFloat(e.target.value) || 2)}
                  variant="outlined"
                  helperText={translations.alphaHelper}
                  error={params.alpha <= 0}
                  inputProps={{ min: 0.01 }}
                />
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
                <TextField
                  fullWidth
                  label={translations.betaParam}
                  type="number"
                  value={params.beta}
                  onChange={(e) => handleParamChange('beta', parseFloat(e.target.value) || 2)}
                  variant="outlined"
                  helperText={translations.betaParamHelper}
                  error={params.beta <= 0}
                  inputProps={{ min: 0.01 }}
                />
              </Box>
            </Box>
          );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {translations.distributionGeneration}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': { height: '56px' }, '& .MuiSelect-select': { fontSize: '1rem', py: 2 } }}>
              <InputLabel sx={{ fontSize: '1rem' }}>{translations.selectDistribution}</InputLabel>
              <Select
                value={distribution}
                label={translations.selectDistribution}
                onChange={(e) => setDistribution(e.target.value as DistributionType)}
                sx={{ fontSize: '1rem' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
              >
                <MenuItem value="normal">{translations.normal}</MenuItem>
                <MenuItem value="uniform">{translations.uniform}</MenuItem>
                <MenuItem value="exponential">{translations.exponential}</MenuItem>
                <MenuItem value="poisson">{translations.poisson}</MenuItem>
                <MenuItem value="binomial">{translations.binomial}</MenuItem>
                <MenuItem value="gamma">{translations.gamma}</MenuItem>
                <MenuItem value="beta">{translations.beta}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%' } }}>
            <TextField
              fullWidth
              label={translations.sampleSize}
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(parseInt(e.target.value) || 100)}
              variant="outlined"
              inputProps={{ min: 10, max: 1000 }}
            />
          </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {distribution === 'normal' && translations.normalParamsTitle}
            {distribution === 'uniform' && translations.uniformParamsTitle}
            {distribution === 'exponential' && translations.exponentialParamsTitle}
            {distribution === 'poisson' && translations.poissonParamsTitle}
            {distribution === 'binomial' && translations.binomialParamsTitle}
            {distribution === 'gamma' && translations.gammaParamsTitle}
            {distribution === 'beta' && translations.betaParamsTitle}
          </Typography>
        {renderParamInputs()}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={generateData}
        sx={{ mt: 4 }}
        fullWidth
      >
        {translations.generateData}
      </Button>
    </Box>
  );
};