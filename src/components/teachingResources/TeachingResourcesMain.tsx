import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material';
import StatisticsMethods from './StatisticsMethods';
import TeachingResources from './TeachingResources';
import CourseStructure from './CourseStructure';
import WebsiteFeatures from './WebsiteFeatures';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const TeachingResourcesMain: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: "统计方法与概念", value: 0 },
    { label: "教学资源建议", value: 1 },
    { label: "课程结构", value: 2 },
    { label: "网站功能", value: 3 }
  ];

  return (
    <Box className="py-4">
      <Typography variant="h4" component="h1" gutterBottom className="text-center text-slate-800 font-bold">
        统计学习教学资源
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" className="text-center mb-8">
        全面的统计方法、教学建议与课程资源
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: '#646cff',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.95rem',
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      
      <Divider sx={{ mb: 4 }} />
      
      <TabPanel value={tabValue} index={0}>
        <StatisticsMethods />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <TeachingResources />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <CourseStructure />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <WebsiteFeatures />
      </TabPanel>
    </Box>
  );
};

export default TeachingResourcesMain;