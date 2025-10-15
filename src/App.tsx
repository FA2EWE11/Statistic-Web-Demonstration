import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Tabs, Tab, Typography, Alert, Button, Container, Paper } from '@mui/material';
import './App.css';

// 导入数据输入组件
import { FileUploadInput } from './components/dataInputs/FileUploadInput';
import { DistributionGenerator } from './components/dataInputs/DistributionGenerator';
import { AIDataGenerator } from './components/dataInputs/AIDataGenerator';

// 导入数据分析组件
import { BasicStatsAnalysis } from './components/dataAnalysis/BasicStatsAnalysis';
import { MLEMOMAnalysis } from './components/dataAnalysis/MLEMOMAnalysis';
import { DataVisualization } from './components/DataVisualization';

// 导入教学资源组件
import TeachingResourcesMain from './components/teachingResources/TeachingResourcesMain';

// 输入方式类型
type InputMethod = 'file' | 'distribution' | 'ai';

// 分析标签类型
type AnalysisTab = 'stats' | 'mlemom' | 'visualization' | 'teaching';

// 语言类型
type Language = 'zh' | 'en';

// 创建浅色主题配置
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#646cff',
    },
    secondary: {
      main: '#747bff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#213547',
      secondary: '#64748b',
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#64748b',
          '&.Mui-selected': {
            color: '#646cff',
            fontWeight: 600,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

function App() {
  // 生成模拟数据的函数已移除，初始数据已清空

  // 语言文本配置
    const translations = {
      zh: {
        appTitle: '统计数据分析工具',
        appDescription: '上传数据、生成分布或使用AI生成数据，然后进行分析和可视化',
        dataInput: '数据输入',
        fileUpload: '文件上传',
        distribution: '分布生成',
        aiGenerate: 'AI生成',
        dataAnalysis: '数据分析',
        clearData: '清除数据',
        basicStats: '基本统计',
        parameterEstimation: '参数估计',
        dataVisualization: '数据可视化',
        teachingResources: '教学资源',
        noDataMessage: '请输入数据以开始分析',
        dataInputHint: '您可以上传文件、生成分布数据或使用AI生成数据',
        builtWith: '基于React、Material-UI、Recharts和Tailwind CSS构建',
        // AI生成器相关
        aiGeneration: 'AI数据生成',
        promptLabel: '数据生成提示词',
        promptPlaceholder: '例如：生成100个符合正态分布的随机数，均值为0，标准差为1',
        sampleSize: '样本大小',
        useMockData: '使用模拟数据（无需API密钥）',
        apiKeyLabel: 'DashScope API密钥',
        apiKeyHelper: '获取API密钥: https://dashscope.console.aliyun.com',
        aiTips: '提示：为确保数据质量，请在提示词中明确指定：',
        dataTypeTip: '数据类型（数值型数据）',
        sampleCountTip: '样本数量',
        distributionTip: '数据分布特征（如适用）',
        rangeTip: '数值范围',
        generating: '生成中...',
        generateData: '生成数据',
        // 文件上传相关
        dropOrClick: '拖拽文件到此处或点击上传',
        supportedFiles: '支持CSV、文本文件和Excel文件',
        fileSizeLimit: '最大文件大小：10MB | 第一行将被视为列标题',
        selectFile: '选择文件',
        processing: '处理中...',
        // 分布生成相关
        distributionType: '分布类型',
        normalDistribution: '正态分布',
        uniformDistribution: '均匀分布',
        exponentialDistribution: '指数分布',
        poissonDistribution: '泊松分布',
        binomialDistribution: '二项分布',
        gammaDistribution: '伽马分布',
        betaDistribution: '贝塔分布',
        normalParams: '正态分布参数',
        uniformParams: '均匀分布参数',
        exponentialParams: '指数分布参数',
        poissonParams: '泊松分布参数',
        binomialParams: '二项分布参数',
        gammaParams: '伽马分布参数',
        betaParams: '贝塔分布参数',
        mean: '均值 (μ)',
        std: '标准差 (σ)',
        min: '最小值',
        max: '最大值',
        lambda: 'λ参数',
        rate: '速率参数 (λ)',
        trials: '试验次数',
        probability: '成功概率',
        shape: '形状参数 (k)',
        scale: '尺度参数 (θ)',
        alpha: 'α参数',
        beta: 'β参数'
      },
      en: {
        appTitle: 'Statistical Data Analysis Tool',
        appDescription: 'Upload data, generate distribution or use AI to generate data, then analyze and visualize',
        dataInput: 'Data Input',
        fileUpload: 'File Upload',
        distribution: 'Distribution Generator',
        aiGenerate: 'AI Generate',
        dataAnalysis: 'Data Analysis',
        clearData: 'Clear Data',
        basicStats: 'Basic Statistics',
        parameterEstimation: 'Parameter Estimation',
        dataVisualization: 'Data Visualization',
        teachingResources: 'Teaching Resources',
        noDataMessage: 'Please input data to start analysis',
        dataInputHint: 'You can upload files, generate distribution data, or use AI to generate data',
        builtWith: 'Built with React, Material-UI, Recharts and Tailwind CSS',
        // AI Generator related
        aiGeneration: 'AI Data Generation',
        promptLabel: 'Data Generation Prompt',
        promptPlaceholder: 'For example: Generate 100 random numbers following normal distribution with mean 0 and standard deviation 1',
        sampleSize: 'Sample Size',
        useMockData: 'Use Mock Data (No API Key Required)',
        apiKeyLabel: 'DashScope API Key',
        apiKeyHelper: 'Get API Key: https://dashscope.console.aliyun.com',
        aiTips: 'Tips: To ensure data quality, please specify in your prompt:',
        dataTypeTip: 'Data type (numerical data)',
        sampleCountTip: 'Sample count',
        distributionTip: 'Distribution characteristics (if applicable)',
        rangeTip: 'Value range',
        generating: 'Generating...',
        generateData: 'Generate Data',
        // File Upload related
        dropOrClick: 'Drag file here or click to upload',
        supportedFiles: 'Supports CSV, Text files and Excel files',
        fileSizeLimit: 'Max file size: 10MB | First row will be treated as column headers',
        selectFile: 'Select File',
        processing: 'Processing...',
        // Distribution Generator related
        distributionType: 'Distribution Type',
        normalDistribution: 'Normal Distribution',
        uniformDistribution: 'Uniform Distribution',
        exponentialDistribution: 'Exponential Distribution',
        poissonDistribution: 'Poisson Distribution',
        binomialDistribution: 'Binomial Distribution',
        gammaDistribution: 'Gamma Distribution',
        betaDistribution: 'Beta Distribution',
        normalParams: 'Normal Distribution Parameters',
        uniformParams: 'Uniform Distribution Parameters',
        exponentialParams: 'Exponential Distribution Parameters',
        poissonParams: 'Poisson Distribution Parameters',
        binomialParams: 'Binomial Distribution Parameters',
        gammaParams: 'Gamma Distribution Parameters',
        betaParams: 'Beta Distribution Parameters',
        mean: 'Mean (μ)',
        std: 'Standard Deviation (σ)',
        min: 'Minimum Value',
        max: 'Maximum Value',
        lambda: 'λ Parameter',
        rate: 'Rate Parameter (λ)',
        trials: 'Number of Trials',
        probability: 'Success Probability',
        shape: 'Shape Parameter (k)',
        scale: 'Scale Parameter (θ)',
        alpha: 'α Parameter',
        beta: 'β Parameter'
      }
    };

  // 状态管理
  const [data, setData] = useState<number[]>([]); // 清空初始数据
  const [language, setLanguage] = useState<Language>('zh'); // 默认中文
  const [currentInputMethod, setCurrentInputMethod] = useState<InputMethod>('file');
  const [currentAnalysisTab, setCurrentAnalysisTab] = useState<AnalysisTab>('stats');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 处理数据变化
  const handleDataChange = (newData: number[]) => {
    setData(newData);
    setError('');
  };

  // 处理错误
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setData([]); // 清除数据
  };

  // 清除数据
  const clearData = () => {
    setData([]);
    setError('');
  };

  // 渲染输入组件
  const renderInputComponent = () => {
    switch (currentInputMethod) {
      case 'file':
        return (
          <FileUploadInput
            onDataChange={handleDataChange}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
            language={language}
            translations={translations[language]}
          />
        );
      case 'distribution':
        return (
          <DistributionGenerator
            onDataChange={handleDataChange}
            onError={handleError}
            language={language}
            translations={translations[language]}
          />
        );
      case 'ai':
        return (
          <AIDataGenerator
            onDataChange={handleDataChange}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
            language={language}
            translations={translations[language]}
          />
        );
      default:
        return null;
    }
  };

  // 渲染数据输入区域
  const renderDataInput = () => {
    return (
      <Box className="input-section" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {translations[language].dataInput}
        </Typography>
        <Tabs
          value={currentInputMethod}
          onChange={(_, newValue) => setCurrentInputMethod(newValue)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label={translations[language].fileUpload} value="file" />
          <Tab label={translations[language].distribution} value="distribution" />
          <Tab label={translations[language].aiGenerate} value="ai" />
        </Tabs>
        <Box className="input-content">
          {renderInputComponent()}
        </Box>
      </Box>
    );
  };

  // 渲染分析组件
  const renderAnalysisComponent = () => {
    switch (currentAnalysisTab) {
      case 'stats':
        return <BasicStatsAnalysis data={data} />;
      case 'mlemom':
        return <MLEMOMAnalysis data={data} />;
      case 'visualization':
        return <DataVisualization data={data} />;
      case 'teaching':
        return <TeachingResourcesMain />;
      default:
        return null;
    }
  };

  // 渲染分析组件已整合到主返回函数中

  return (
    <ThemeProvider theme={lightTheme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <Container maxWidth="lg" className="app-container">
          <div className="mb-8 text-center">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button 
                variant={language === 'zh' ? 'contained' : 'outlined'}
                onClick={() => setLanguage('zh')}
                sx={{ mr: 1, minWidth: '80px' }}
              >
                中文
              </Button>
              <Button 
                variant={language === 'en' ? 'contained' : 'outlined'}
                onClick={() => setLanguage('en')}
                sx={{ minWidth: '80px' }}
              >
                English
              </Button>
            </Box>
            <Typography variant="h4" component="h1" gutterBottom className="text-slate-800 font-bold">
              {translations[language].appTitle}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {translations[language].appDescription}
            </Typography>
          </div>

          <Paper elevation={0} className="p-6 mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} className="rounded-lg">
                {error}
              </Alert>
            )}
            {renderDataInput()}
          </Paper>

          <Paper elevation={0} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            {data.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6" className="text-slate-700 font-semibold">
                    {translations[language].dataAnalysis}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={clearData}
                    className="border-gray-300 text-slate-700 hover:bg-slate-50"
                  >
                    {translations[language].clearData}
                  </Button>
                </div>
                <Tabs 
                  value={currentAnalysisTab} 
                  onChange={(_, newValue) => setCurrentAnalysisTab(newValue as AnalysisTab)}
                  variant="fullWidth"
                  sx={{ mb: 3 }}
                >
                  <Tab label={translations[language].basicStats} value="stats" />
                  <Tab label={translations[language].parameterEstimation} value="mlemom" />
                  <Tab label={translations[language].dataVisualization} value="visualization" />
                  <Tab label={translations[language].teachingResources} value="teaching" />
                </Tabs>
                {renderAnalysisComponent()}
              </>
            ) : (
              <div className="text-center py-12">
                <Typography variant="body1" color="textSecondary" paragraph>
                  {translations[language].noDataMessage}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {translations[language].dataInputHint}
                </Typography>
              </div>
            )}
          </Paper>
          
          <div className="text-center mt-8 text-slate-500 text-sm">
            <Typography variant="body2">
              {translations[language].builtWith}
            </Typography>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;