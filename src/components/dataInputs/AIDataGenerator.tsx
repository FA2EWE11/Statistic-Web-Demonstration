import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';

interface Translations {
  aiGeneration: string;
  promptLabel: string;
  promptPlaceholder: string;
  sampleSize: string;
  useMockData: string;
  apiKeyLabel: string;
  apiKeyHelper: string;
  aiTips: string;
  dataTypeTip: string;
  sampleCountTip: string;
  distributionTip: string;
  rangeTip: string;
  generating: string;
  generateData: string;
}

interface AIDataGeneratorProps {
  onDataChange: (data: number[]) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  language: 'zh' | 'en';
  translations: Translations;
}

export const AIDataGenerator: React.FC<AIDataGeneratorProps> = ({
  onDataChange,
  onError,
  loading,
  setLoading,
  language,
  translations
}) => {
  const [prompt, setPrompt] = useState<string>(language === 'zh' ? '生成100个符合正态分布的随机数，均值为0，标准差为1' : 'Generate 100 random numbers following normal distribution with mean 0 and standard deviation 1');
  const [apiKey, setApiKey] = useState<string>('');
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [sampleSize, setSampleSize] = useState<number>(100);

  // 从AI响应中提取数字数据
  const extractNumbersFromResponse = (response: string): number[] => {
    try {
      // 尝试多种模式提取数字
      
      // 模式1: 查找数组格式的数据
      const arrayMatch = response.match(/\[([^\]]+)\]/);
      if (arrayMatch) {
        const numbers = arrayMatch[1].split(/[,\s]+/)
          .map(item => parseFloat(item.trim()))
          .filter(num => !isNaN(num));
        if (numbers.length > 0) return numbers;
      }

      // 模式2: 查找JSON格式数据
      try {
        const jsonMatch = response.match(/\{[^}]*"data"[^}]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.data)) {
            const numbers = parsed.data
              .map((item: any) => parseFloat(item))
              .filter((num: number) => !isNaN(num));
            if (numbers.length > 0) return numbers;
          }
        }
      } catch (e) {
        // JSON解析失败，继续尝试其他方法
      }

      // 模式3: 提取所有数字
      const allNumbers = response.match(/-?\d+\.?\d*/g);
      if (allNumbers) {
        const numbers = allNumbers
          .map(item => parseFloat(item))
          .filter(num => !isNaN(num));
        if (numbers.length > 0) return numbers;
      }

      throw new Error('无法从AI响应中提取有效数字数据');
    } catch (error) {
      throw error;
    }
  };

  // 生成模拟数据（备选方案）
  const generateMockData = (size: number): number[] => {
    const mockData: number[] = [];
    // 生成混合分布的数据，使其看起来更真实
    for (let i = 0; i < size; i++) {
      // 80%概率生成正态分布，20%概率生成异常值
      if (Math.random() < 0.8) {
        // 正态分布，均值为50，标准差为15
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        mockData.push(z0 * 15 + 50);
      } else {
        // 异常值
        mockData.push(Math.random() > 0.5 ? 
          Math.random() * 100 + 100 : // 大异常值
          Math.random() * 50 // 小异常值
        );
      }
    }
    return mockData;
  };

  // 调用DashScope API生成数据
  const callDashScopeAPI = async (): Promise<number[]> => {
    if (!apiKey && !useMockData) {
      throw new Error('请输入DashScope API密钥或选择使用模拟数据');
    }

    if (useMockData) {
      // 使用模拟数据
      return generateMockData(sampleSize);
    }

    try {
      const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          input: {
            prompt: `${prompt}\n\n请以数组格式返回结果，只包含数字，不要其他说明文字。例如：[1.2, 3.4, 5.6]`
          },
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status}`);
      }

      const data = await response.json();
      if (!data.output || !data.output.text) {
        throw new Error('API返回格式不正确');
      }

      return extractNumbersFromResponse(data.output.text);
    } catch (error) {
      // 如果API调用失败，提供友好的错误信息并建议使用模拟数据
      const errorMessage = error instanceof Error ? error.message : 'API调用失败';
      throw new Error(`DashScope API调用失败: ${errorMessage}。建议使用模拟数据。`);
    }
  };

  // 生成数据
  const generateData = async () => {
    if (!prompt.trim()) {
      onError('请输入有效的提示词');
      return;
    }

    setLoading(true);

    try {
      const data = await callDashScopeAPI();
      
      if (data.length === 0) {
        throw new Error('无法从AI响应中提取有效数据');
      }

      // 如果数据超过sampleSize，截断到指定大小
      const finalData = data.slice(0, sampleSize);
      onDataChange(finalData);
    } catch (error) {
      onError(error instanceof Error ? error.message : '数据生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {translations.aiGeneration}
      </Typography>
      
      <TextField
        fullWidth
        label={translations.promptLabel}
        multiline
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        placeholder={translations.promptPlaceholder}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label={translations.sampleSize}
        type="number"
        value={sampleSize}
        onChange={(e) => setSampleSize(parseInt(e.target.value) || 100)}
        variant="outlined"
        inputProps={{ min: 1, max: 10000 }}
        sx={{ mb: 3 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={useMockData}
            onChange={(e) => setUseMockData(e.target.checked)}
          />
        }
        label={translations.useMockData}
      />

      {!useMockData && (
        <TextField
          fullWidth
          label={translations.apiKeyLabel}
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          variant="outlined"
          helperText={translations.apiKeyHelper}
          sx={{ mb: 3 }}
        />
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        {translations.aiTips}
        <ul>
          <li>{translations.dataTypeTip}</li>
          <li>{translations.sampleCountTip}</li>
          <li>{translations.distributionTip}</li>
          <li>{translations.rangeTip}</li>
        </ul>
      </Alert>

      <Button
        variant="contained"
        color="primary"
        onClick={generateData}
        disabled={loading}
        fullWidth
        sx={{ py: 1.5 }}
      >
        {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                {translations.generating}
              </>
            ) : (
              translations.generateData
            )}
      </Button>
    </Box>
  );
};