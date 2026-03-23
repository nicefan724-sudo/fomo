import React from 'react';
import { View, Text } from '@tarojs/components';
import BottomTabBar from '../../components/BottomTabBar';
import './index.scss';

/**
 * 统计页面占位符 (Sprint 2)
 */
const StatisticsPage = () => {
  return (
    <View className="statistics-container">
      <View className="placeholder">
        <Text className="placeholder-icon">📊</Text>
        <Text className="placeholder-title">数据统计</Text>
        <Text className="placeholder-text">
          这个功能正在开发中...
        </Text>
        <Text className="placeholder-tip">
          Sprint 2 将实现：焦虑度趋势、分类统计、成就徽章
        </Text>
      </View>
      <BottomTabBar active="statistics" />
    </View>
  );
};

export default StatisticsPage;
