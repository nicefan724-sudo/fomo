/**
 * 日记卡片组件
 */

import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

const DiaryCard = ({ diary, onDelete }) => {
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category) => {
    const icons = {
      social: '💬',
      shopping: '🛍️',
      career: '💼',
      other: '✨'
    };
    return icons[category] || '📝';
  };

  // 获取焦虑度颜色
  const getAnxietyColor = (score) => {
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    return 'high';
  };

  // 点击卡片进入详情
  const handleCardClick = () => {
    Taro.navigateTo({ url: `/pages/diaryDetail/index?id=${diary._id}` });
  };

  // 编辑
  const handleEdit = (e) => {
    e.stopPropagation();
    Taro.navigateTo({ url: `/pages/diaryEdit/index?id=${diary._id}` });
  };

  // 删除
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(diary._id);
    }
  };

  return (
    <View className="diary-card" onClick={handleCardClick}>
      {/* 卡片头部 */}
      <View className="card-header">
        <View className="card-title-section">
          <Text className="card-category-icon">
            {getCategoryIcon(diary.category)}
          </Text>
          <View className="card-title-text">
            <Text className="card-title">{diary.title}</Text>
            <Text className="card-date">{formatDate(diary.createdAt)}</Text>
          </View>
        </View>

        {/* 焦虑度指示 */}
        <View className={`anxiety-badge anxiety-${getAnxietyColor(diary.anxietyScore)}`}>
          <Text className="anxiety-score">{diary.anxietyScore}</Text>
        </View>
      </View>

      {/* 卡片内容 */}
      <View className="card-content">
        <Text className="card-preview">
          {diary.content.substring(0, 80)}...
        </Text>
      </View>

      {/* 卡片底部 */}
      <View className="card-footer">
        <View className="card-stats">
          <Text className="stat-item">
            👍 {diary.likes}
          </Text>
          <Text className="stat-item">
            💬 {diary.comments}
          </Text>
          <Text className="stat-item">
            📤 {diary.shares}
          </Text>
        </View>

        {/* 隐私标签 */}
        <View className={`privacy-badge privacy-${diary.privacy}`}>
          {diary.privacy === 'private' && '🔒 私密'}
          {diary.privacy === 'friends' && '👥 朋友'}
          {diary.privacy === 'public' && (diary.isAnonymous ? '🕵️ 匿名' : '🌐 公开')}
        </View>
      </View>

      {/* 操作菜单（长按或右滑） */}
      <View className="card-actions">
        <Text className="action-btn edit-btn" onClick={handleEdit}>编辑</Text>
        <Text className="action-btn delete-btn" onClick={handleDelete}>删除</Text>
      </View>
    </View>
  );
};

export default DiaryCard;
