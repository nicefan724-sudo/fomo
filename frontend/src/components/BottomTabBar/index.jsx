/**
 * 底部导航栏组件 (E4 任务)
 */

import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

const BottomTabBar = ({ active = 'home' }) => {
  const tabs = [
    {
      id: 'home',
      name: '首页',
      icon: '🏠',
      path: '/pages/home/index'
    },
    {
      id: 'statistics',
      name: '统计',
      icon: '📊',
      path: '/pages/statistics/index'
    },
    {
      id: 'community',
      name: '社区',
      icon: '🌐',
      path: '/pages/community/index'
    },
    {
      id: 'mine',
      name: '我的',
      icon: '👤',
      path: '/pages/mine/index'
    }
  ];

  const handleTabClick = (tab) => {
    if (tab.id !== active) {
      Taro.switchTab({ url: tab.path });
    }
  };

  return (
    <View className="tab-bar">
      {tabs.map((tab) => (
        <View
          key={tab.id}
          className={`tab-item ${tab.id === active ? 'active' : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          <Text className="tab-icon">{tab.icon}</Text>
          <Text className="tab-label">{tab.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default BottomTabBar;
