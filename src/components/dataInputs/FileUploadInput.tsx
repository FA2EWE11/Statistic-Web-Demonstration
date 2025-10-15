import React, { useRef, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

interface FileUploadInputProps {
  onDataChange: (data: number[]) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// 最大文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onDataChange,
  onError,
  loading,
  setLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      onError('文件大小超过限制（最大10MB）');
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const data = await parseFile(file);
      if (data.length === 0) {
        throw new Error('文件中未找到有效的数字数据');
      }
      onDataChange(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : '文件解析失败');
    } finally {
      setLoading(false);
    }
  };

  // 解析文件内容
  const parseFile = (file: File): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      // 检查文件类型
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // 对于Excel文件，显示提示信息（实际项目中可以使用xlsx库解析）
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        reject(new Error('Excel文件解析功能即将推出，请先使用CSV格式文件'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) {
            reject(new Error('文件内容为空'));
            return;
          }

          // 尝试解析CSV或纯文本文件
          const lines = content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

          // 跳过标题行（假设第一行是列名）
          const dataLines = lines.length > 0 ? lines.slice(1) : lines;

          // 尝试不同的解析策略
          let data: number[] = [];

          // 策略1: 按分隔符分割每行数据
          data = dataLines.flatMap(line => {
            // 尝试按逗号、分号、制表符等常见分隔符分割
            const separators = [',', ';', '\t', ' '];
            let values: string[] = [];
            
            for (const sep of separators) {
              const splitValues = line.split(sep).map(item => item.trim()).filter(item => item.length > 0);
              if (splitValues.length > 1) {
                values = splitValues;
                break;
              }
            }
            
            // 如果没有找到分隔符，尝试将整行作为一个值
            if (values.length === 0) {
              values = [line];
            }
            
            // 尝试将所有值转换为数字
            return values.map(item => {
              const num = parseFloat(item);
              return isNaN(num) ? null : num;
            }).filter((num): num is number => num !== null);
          });

          if (data.length === 0) {
            reject(new Error('无法从文件中提取有效数字数据，请确保文件包含数值列'));
            return;
          }

          resolve(data);
        } catch (error) {
          reject(new Error('文件解析错误'));
        }
      };

      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };

      reader.readAsText(file);
    });
  };

  // 处理拖放
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    // 触发文件输入的change事件
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Box className="file-upload-area" sx={{ textAlign: 'center', py: 4 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.xlsx,.xls"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '30px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#646cff',
            backgroundColor: '#f0f0ff'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <Box className="loading-indicator">
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>处理中...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {fileName || '拖拽文件到此处或点击上传'}
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              支持CSV、文本文件和Excel文件
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
              最大文件大小：10MB | 第一行将被视为列标题
            </Typography>
            <Button variant="contained" color="primary">
              选择文件
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};