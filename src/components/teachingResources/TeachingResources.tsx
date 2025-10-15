import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';

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

const TeachingResources: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={0} className="p-6 rounded-xl border border-gray-200">
      <Typography variant="h5" component="h2" gutterBottom className="text-slate-800 font-bold">
        教学资源建议
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="可视化工具" />
        <Tab label="实战案例" />
        <Tab label="代码片段" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            可视化工具推荐
          </Typography>
          
          <div className="space-y-4">
            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-blue-50">
              <Typography variant="subtitle1" gutterBottom className="text-blue-800 font-semibold">
                直方图与箱线图
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>用途：</strong>用于数据分布探索与异常值检测
              </Typography>
              <Typography variant="body2">
                <strong>特点：</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>直方图直观展示数据分布形状（正态、偏态等）</li>
                  <li>箱线图清晰标识四分位数、中位数和异常值</li>
                  <li>结合使用可全面了解数据特征</li>
                </ul>
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-green-50">
              <Typography variant="subtitle1" gutterBottom className="text-green-800 font-semibold">
                QQ图
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>用途：</strong>检验数据是否服从正态分布
              </Typography>
              <Typography variant="body2">
                <strong>解读：</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>数据点越接近对角线，表示越接近正态分布</li>
                  <li>偏离对角线的程度表示与正态分布的差异</li>
                  <li>可用于检验其他分布拟合情况</li>
                </ul>
              </Typography>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100 bg-purple-50">
              <Typography variant="subtitle1" gutterBottom className="text-purple-800 font-semibold">
                Gamma / 正态 / t / F 分布图
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>用途：</strong>展示不同参数下的分布形态
              </Typography>
              <Typography variant="body2">
                <strong>教学价值：</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>直观理解参数变化对分布形状的影响</li>
                  <li>帮助选择合适的统计模型</li>
                  <li>加深对概率密度函数的理解</li>
                </ul>
              </Typography>
            </Paper>
          </div>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            实战案例建议
          </Typography>
          
          <div className="space-y-5">
            <Accordion className="rounded-lg overflow-hidden shadow-none border border-gray-200">
              <AccordionSummary expandIcon={<span>▼</span>} className="bg-red-50">
                <Typography variant="subtitle1" className="text-red-800 font-semibold">
                  新冠疫情数据分析
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>数据源：</strong>如 Lecture2 中 UM 数据
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>分析内容：</strong>
                </Typography>
                <ul className="list-disc pl-5 mb-3">
                  <li>可视化每日感染数</li>
                  <li>预测未来感染趋势</li>
                  <li>构建感染率的置信区间</li>
                </ul>
                <Chip label="时间序列分析" color="error" size="small" className="mr-2" />
                <Chip label="预测建模" color="warning" size="small" />
              </AccordionDetails>
            </Accordion>

            <Accordion className="rounded-lg overflow-hidden shadow-none border border-gray-200">
              <AccordionSummary expandIcon={<span>▼</span>} className="bg-amber-50">
                <Typography variant="subtitle1" className="text-amber-800 font-semibold">
                  产品寿命分析
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  <strong>示例：</strong>灯泡寿命数据
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>分析内容：</strong>
                </Typography>
                <ul className="list-disc pl-5 mb-3">
                  <li>使用指数/伽马分布建模</li>
                  <li>构建平均寿命的单侧置信区间</li>
                  <li>可靠性分析</li>
                </ul>
                <Chip label="生存分析" color="warning" size="small" className="mr-2" />
                <Chip label="可靠性工程" color="info" size="small" />
              </AccordionDetails>
            </Accordion>
          </div>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="h6" gutterBottom className="text-slate-700 font-semibold">
            R / Python 代码片段
          </Typography>
          
          <div className="space-y-5">
            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100">
              <Typography variant="subtitle2" gutterBottom className="text-slate-700 font-semibold">
                MLE 与 MoM 的实现（Python）
              </Typography>
              <Box className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {`import numpy as np
from scipy.optimize import minimize
from scipy.stats import norm

# MLE 估计正态分布参数
def mle_normal(data):
    def neg_log_likelihood(params):
        mu, sigma = params
        return -np.sum(norm.logpdf(data, mu, sigma))
    
    initial_guess = [np.mean(data), np.std(data)]
    result = minimize(neg_log_likelihood, initial_guess)
    return result.x  # 返回 [mu, sigma]

# MoM 估计正态分布参数
def mom_normal(data):
    mu = np.mean(data)
    sigma = np.std(data)
    return [mu, sigma]

# 使用示例
data = np.random.normal(0, 1, 100)
mle_params = mle_normal(data)
mom_params = mom_normal(data)
print(f"MLE: μ={mle_params[0]:.4f}, σ={mle_params[1]:.4f}")
print(f"MoM: μ={mom_params[0]:.4f}, σ={mom_params[1]:.4f}")`}
                </pre>
              </Box>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100">
              <Typography variant="subtitle2" gutterBottom className="text-slate-700 font-semibold">
                置信区间的计算（R）
              </Typography>
              <Box className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {`# t-test 计算置信区间
data <- rnorm(30, mean=50, sd=10)
t_test_result <- t.test(data, conf.level=0.95)
cat("t-test 置信区间:\n")
print(t_test_result$conf.int)

# z-test 计算置信区间（已知方差）
z_test_ci <- function(data, sigma, conf.level=0.95) {
  n <- length(data)
  mean_data <- mean(data)
  alpha <- 1 - conf.level
  z_critical <- qnorm(1 - alpha/2)
  margin_error <- z_critical * sigma / sqrt(n)
  lower <- mean_data - margin_error
  upper <- mean_data + margin_error
  return(c(lower, upper))
}

# 使用示例
sigma_known <- 10  # 假设已知标准差
z_ci <- z_test_ci(data, sigma_known)
cat("\nz-test 置信区间:\n")
print(z_ci)`}
                </pre>
              </Box>
            </Paper>

            <Paper elevation={0} className="p-4 rounded-lg border border-gray-100">
              <Typography variant="subtitle2" gutterBottom className="text-slate-700 font-semibold">
                分布拟合与图像绘制（Python）
              </Typography>
              <Box className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {`import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm, gamma, expon

# 生成样本数据
data = np.random.gamma(2, 3, 500)

# 拟合伽马分布
from scipy.stats import gamma
shape, loc, scale = gamma.fit(data)

# 绘制直方图和拟合曲线
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, density=True, alpha=0.6, color='g', label='样本直方图')

# 生成拟合分布的概率密度函数
x = np.linspace(0, max(data), 100)
pdf_fitted = gamma.pdf(x, shape, loc, scale)
plt.plot(x, pdf_fitted, 'r-', linewidth=2, label=f'拟合伽马分布 (k={shape:.2f}, θ={scale:.2f})')

plt.title('伽马分布拟合')
plt.xlabel('值')
plt.ylabel('概率密度')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()`}
                </pre>
              </Box>
            </Paper>
          </div>
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default TeachingResources;