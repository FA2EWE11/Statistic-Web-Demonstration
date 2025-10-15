import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Chip, Stepper, Step, StepLabel } from '@mui/material';

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

const WebsiteFeatures: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const learningPaths = [
    {
      title: "初学者路径",
      color: "primary",
      steps: [
        "概率基础",
        "描述统计",
        "可视化"
      ]
    },
    {
      title: "进阶者路径",
      color: "secondary",
      steps: [
        "参数估计",
        "置信区间",
        "假设检验",
        "回归"
      ]
    },
    {
      title: "实战者路径",
      color: "success",
      steps: [
        "案例研究",
        "代码实战",
        "项目练习"
      ]
    }
  ];

  return (
    <Paper elevation={0} className="p-6 rounded-xl border border-gray-200">
      <Typography variant="h5" component="h2" gutterBottom className="text-slate-800 font-bold">
        网站功能建议
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="交互式工具" />
        <Tab label="学习路径设计" />
        <Tab label="上线内容模块" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            交互式工具
          </Typography>
          
          <div className="space-y-4">
            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-purple-50">
              <Typography variant="subtitle1" gutterBottom className="text-purple-800 font-semibold">
                分布模拟器
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>功能：</strong>调整参数看分布变化
              </Typography>
              <Typography variant="body2">
                <strong>支持的分布：</strong>
              </Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                <Chip label="正态分布" color="primary" size="small" />
                <Chip label="伽马分布" color="secondary" size="small" />
                <Chip label="指数分布" color="info" size="small" />
                <Chip label="泊松分布" color="success" size="small" />
                <Chip label="均匀分布" color="warning" size="small" />
              </div>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-blue-50">
              <Typography variant="subtitle1" gutterBottom className="text-blue-800 font-semibold">
                置信区间计算器
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>功能：</strong>输入样本、置信水平，计算并可视化置信区间
              </Typography>
              <Typography variant="body2">
                <strong>支持的区间类型：</strong>
              </Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                <Chip label="Z 区间" color="primary" size="small" />
                <Chip label="T 区间" color="secondary" size="small" />
                <Chip label="单侧区间" color="warning" size="small" />
                <Chip label="双侧区间" color="success" size="small" />
              </div>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-green-50">
              <Typography variant="subtitle1" gutterBottom className="text-green-800 font-semibold">
                MLE / MoM 计算器
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>功能：</strong>输入样本，输出估计值
              </Typography>
              <Typography variant="body2">
                <strong>支持的分布：</strong>
              </Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                <Chip label="正态分布" color="primary" size="small" />
                <Chip label="指数分布" color="info" size="small" />
                <Chip label="均匀分布" color="warning" size="small" />
                <Chip label="泊松分布" color="success" size="small" />
              </div>
            </Paper>
          </div>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            学习路径设计
          </Typography>
          
          <div className="space-y-6">
            {learningPaths.map((path, index) => (
              <Paper key={index} elevation={0} className="p-4 rounded-lg border border-gray-100">
                <Typography variant="subtitle1" gutterBottom className={`text-${path.color}-800 font-semibold`}>
                  {path.title}
                </Typography>
                <Stepper orientation="vertical">
                  {path.steps.map((step, stepIndex) => (
                    <Step key={stepIndex} expanded={true}>
                      <StepLabel>{step}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            ))}
          </div>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            可立即上线的网站内容模块
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-blue-50">
              <Typography variant="subtitle1" gutterBottom className="text-blue-800 font-semibold">
                方法库
              </Typography>
              <Typography variant="body2">
                MLE、MoM、CI、假设检验、ANOVA、回归
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-green-50">
              <Typography variant="subtitle1" gutterBottom className="text-green-800 font-semibold">
                可视化
              </Typography>
              <Typography variant="body2">
                分布图、箱线图、直方图、QQ图
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-purple-50">
              <Typography variant="subtitle1" gutterBottom className="text-purple-800 font-semibold">
                案例库
              </Typography>
              <Typography variant="body2">
                新冠疫情、产品寿命、顾客行为等
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-amber-50">
              <Typography variant="subtitle1" gutterBottom className="text-amber-800 font-semibold">
                代码库
              </Typography>
              <Typography variant="body2">
                R/Python 实现统计方法
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-pink-50">
              <Typography variant="subtitle1" gutterBottom className="text-pink-800 font-semibold">
                学习路径
              </Typography>
              <Typography variant="body2">
                从基础到进阶的课程结构
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-cyan-50">
              <Typography variant="subtitle1" gutterBottom className="text-cyan-800 font-semibold">
                工具集
              </Typography>
              <Typography variant="body2">
                在线计算器、分布模拟器
              </Typography>
            </Paper>
          </div>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default WebsiteFeatures;