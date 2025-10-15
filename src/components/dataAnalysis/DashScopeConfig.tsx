import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, useTheme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

interface DashScopeConfigProps {
  onApiKeyChange: (apiKey: string) => void;
  currentApiKey?: string;
}

export const DashScopeConfig: React.FC<DashScopeConfigProps> = ({ 
  onApiKeyChange, 
  currentApiKey = '' 
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('请输入有效的API Key');
      setSuccess('');
      return;
    }

    // 简单的API Key格式验证（假设DashScope API Key是sk-开头的字符串）
    if (!apiKey.trim().startsWith('sk-')) {
      setError('API Key格式不正确，应该以sk-开头');
      setSuccess('');
      return;
    }

    // 保存API Key
    onApiKeyChange(apiKey.trim());
    setSuccess('API Key保存成功！');
    setError('');
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      boxShadow: 1,
      mb: 4
    }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        DashScope API 配置
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        请输入您的阿里云DashScope API Key以启用AI增强功能。
        <br />
        <span className="text-xs text-gray-500">
          获取API Key: <a href="https://dashscope.console.aliyun.com/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600">阿里云DashScope控制台</a>
        </span>
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="API Key"
        type="password"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          setError('');
          setSuccess('');
        }}
        placeholder="sk-xxxxxxxxxxxxxxxx"
        margin="normal"
        InputProps={{
          sx: {
            '& .MuiOutlinedInput-input': {
              fontSize: isMobile ? '0.875rem' : '1rem',
            },
          },
        }}
        error={!!error}
        helperText={error || (apiKey ? '已输入API Key' : '')}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            flex: 1,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          保存API Key
        </Button>
        
        {currentApiKey && (
          <Button
            variant="outlined"
            onClick={() => {
              setApiKey('');
              onApiKeyChange('');
              setSuccess('API Key已清除');
              setError('');
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            清除
          </Button>
        )}
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};