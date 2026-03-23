import React from 'react';
import { View, Text } from '@tarojs/components';
import BottomTabBar from '../../components/BottomTabBar';
import './index.scss';

/**
 * 社区页面占位符 (Sprint 2)
 */
const CommunityPage = () => {
  return (
    <View className="community-container">
      <View className="placeholder">
        <Text className="placeholder-icon">🌐</Text>
        <Text className="placeholder-title">社区分享</Text>
        <Text className="placeholder-text">
          这个功能正在开发中...
        </Text>
        <Text className="placeholder-tip">
          Sprint 2 将实现：公开日记流、点赞评论、社区互动
        </Text>
      </View>
      <BottomTabBar active="community" />
    </View>
  );
};

export default CommunityPage;
