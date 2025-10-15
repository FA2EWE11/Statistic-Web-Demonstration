import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Chip } from '@mui/material';

const CourseStructure: React.FC = () => {
  return (
    <Paper elevation={0} className="p-6 rounded-xl border border-gray-200">
      <Typography variant="h5" component="h2" gutterBottom className="text-slate-800 font-bold">
        课程结构与教学资料整合
      </Typography>
      
      <Box className="mb-8">
        <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
          课程章节建议
        </Typography>
        
        <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-lg">
          <Table>
            <TableHead className="bg-slate-50">
              <TableRow>
                <TableCell className="font-semibold text-slate-700">章节</TableCell>
                <TableCell className="font-semibold text-slate-700">内容</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className="hover:bg-slate-50">
                <TableCell>1</TableCell>
                <TableCell>概率与统计基础回顾</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>2</TableCell>
                <TableCell>数据可视化与探索性分析</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>3</TableCell>
                <TableCell>参数估计（MLE, MoM）</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>4</TableCell>
                <TableCell>置信区间</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>5</TableCell>
                <TableCell>假设检验</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>6</TableCell>
                <TableCell>方差分析（ANOVA）</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>7</TableCell>
                <TableCell>回归分析</TableCell>
              </TableRow>
              <TableRow className="hover:bg-slate-50">
                <TableCell>8</TableCell>
                <TableCell>非参数方法</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
          推荐教材与参考书
        </Typography>
        
        <Paper elevation={0} className="p-5 rounded-lg border border-gray-100 bg-blue-50 mb-4">
          <Typography variant="subtitle1" gutterBottom className="text-blue-800 font-semibold">
            主教材
          </Typography>
          <Typography variant="body1" paragraph className="text-slate-800">
            Hogg, Tanis & Zimmerman, <strong>Probability and Statistical Inference</strong>, 9th Ed.
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Chip label="经典教材" color="primary" size="small" />
            <Chip label="理论与应用结合" color="info" size="small" />
            <Chip label="全面覆盖" color="success" size="small" />
          </div>
        </Paper>
        
        <Paper elevation={0} className="p-5 rounded-lg border border-gray-100 bg-green-50">
          <Typography variant="subtitle1" gutterBottom className="text-green-800 font-semibold">
            补充资源
          </Typography>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li>
              <Typography variant="body1" className="text-slate-800">
                <strong>R 语言实战</strong> - 实用的R编程指南
              </Typography>
            </li>
            <li>
              <Typography variant="body1" className="text-slate-800">
                <strong>Python 统计建模</strong> - 重点关注 scipy.stats 和 statsmodels 库
              </Typography>
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Chip label="实践导向" color="success" size="small" />
            <Chip label="代码示例" color="warning" size="small" />
            <Chip label="现代工具" color="secondary" size="small" />
          </div>
        </Paper>
      </Box>
    </Paper>
  );
};

export default CourseStructure;