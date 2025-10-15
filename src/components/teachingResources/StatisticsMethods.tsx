import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Divider, Chip } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const StatisticsMethods: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={0} className="p-6 rounded-xl border border-gray-200">
      <Typography variant="h5" component="h2" gutterBottom className="text-slate-800 font-bold">
        核心统计方法与概念
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="参数估计" />
        <Tab label="置信区间" />
        <Tab label="假设检验" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            参数估计方法
          </Typography>
          
          <Paper elevation={0} className="p-4 mb-4 rounded-lg border border-gray-100 bg-blue-50">
            <Typography variant="subtitle1" gutterBottom className="text-blue-800 font-semibold">
              最大似然估计（MLE）
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>适用于：</strong>伯努利、指数、几何、均匀、正态、伽马分布等
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>步骤：</strong>
            </Typography>
            <ul className="list-disc pl-5 mb-3">
              <li>写出似然函数</li>
              <li>取对数</li>
              <li>求导</li>
              <li>解方程</li>
            </ul>
          </Paper>

          <Paper elevation={0} className="p-4 mb-4 rounded-lg border border-gray-100 bg-green-50">
            <Typography variant="subtitle1" gutterBottom className="text-green-800 font-semibold">
              矩估计法（MoM）
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>适用于：</strong>伽马、泊松、均匀分布等
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>步骤：</strong>
            </Typography>
            <ul className="list-disc pl-5 mb-3">
              <li>设样本矩等于理论矩</li>
              <li>解方程组</li>
            </ul>
          </Paper>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom className="text-slate-700 font-semibold">
            比较：
          </Typography>
          <div className="flex flex-wrap gap-2 mb-4">
            <Chip label="MLE 更常用" color="primary" size="small" />
            <Chip label="MoM 计算快" color="success" size="small" />
            <Chip label="MoM 不唯一" color="warning" size="small" />
            <Chip label="MoM 适用于复杂模型" color="info" size="small" />
          </div>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            置信区间构建
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom className="text-slate-700 font-semibold">
            四种情形：
          </Typography>
          
          <div className="space-y-4 mb-6">
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-purple-50">
              <Typography variant="body2">
                <strong>正态 + 方差已知 →</strong> $z$ 区间
              </Typography>
            </Paper>
            
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-indigo-50">
              <Typography variant="body2">
                <strong>非正态 + 方差已知 →</strong> 近似 $z$ 区间（CLT）
              </Typography>
            </Paper>
            
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-blue-50">
              <Typography variant="body2">
                <strong>正态 + 方差未知 →</strong> $t$ 区间
              </Typography>
            </Paper>
            
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-cyan-50">
              <Typography variant="body2">
                <strong>非正态 + 方差未知 →</strong> 近似 $t$ 区间（大样本）
              </Typography>
            </Paper>
          </div>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom className="text-slate-700 font-semibold">
            单侧 vs 双侧置信区间
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>单侧置信区间：</strong>适用于有方向性推断的场景（如寿命下限）
          </Typography>
          <Typography variant="body2">
            <strong>双侧置信区间：</strong>适用于估计参数的可能范围，不指定方向
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            假设检验基础
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom className="text-slate-700 font-semibold">
            检验类型：
          </Typography>
          <div className="flex flex-wrap gap-2 mb-6">
            <Chip label="$t$-检验" color="primary" />
            <Chip label="$F$-检验" color="secondary" />
            <Chip label="卡方检验" color="success" />
            <Chip label="Wilcoxon 检验" color="info" />
          </div>
          
          <Typography variant="subtitle1" gutterBottom className="text-slate-700 font-semibold">
            核心概念：
          </Typography>
          
          <div className="space-y-4">
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-amber-50">
              <Typography variant="body2" paragraph>
                <strong>零假设 vs 备择假设：</strong>
                零假设（H₀）通常表示没有效应或差异，备择假设（H₁）表示存在效应或差异
              </Typography>
            </Paper>
            
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-rose-50">
              <Typography variant="body2" paragraph>
                <strong>$p$-值、显著性水平、检验功效：</strong>
                $p$-值是观察到的样本结果至少与实际结果一样极端的概率；显著性水平（α）通常设为0.05；检验功效是正确拒绝零假设的概率
              </Typography>
            </Paper>
            
            <Paper elevation={0} className="p-3 rounded-lg border border-gray-100 bg-orange-50">
              <Typography variant="body2" paragraph>
                <strong>第一类错误与第二类错误：</strong>
                第一类错误（α）是拒绝了正确的零假设；第二类错误（β）是未能拒绝错误的零假设
              </Typography>
            </Paper>
          </div>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default StatisticsMethods;