import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import apiClient from '../../utils/api';
import './index.scss';

/**
 * 日记详情页面
 */
const DiaryDetailPage = () => {
  const route = Taro.useRouter();
  const diaryId = route.params?.id;

  const [diary, setDiary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (diaryId) {
      loadDiary();
    }
  }, [diaryId]);

  const loadDiary = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/diaries/${diaryId}`);
      
      if (response.success) {
        setDiary(response.data);
      }
    } catch (error) {
      Taro.showToast({ title: '加载失败', icon: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="detail-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!diary) {
    return (
      <View className="detail-error">
        <Text>日记不存在</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView className="diary-detail" scrollY>
      <View className="detail-header">
        <Text className="detail-title">{diary.title}</Text>
        <Text className="detail-date">{formatDate(diary.createdAt)}</Text>
      </View>

      <View className="detail-meta">
        <View className="meta-item">
          <Text className="meta-label">分类</Text>
          <Text className="meta-value">{diary.category}</Text>
        </View>
        <View className="meta-item">
          <Text className="meta-label">焦虑指数</Text>
          <Text className="meta-value">{diary.anxietyScore}/10</Text>
        </View>
      </View>

      <View className="detail-section">
        <Text className="section-title">发生了什么</Text>
        <Text className="section-content">{diary.content}</Text>
      </View>

      <View className="detail-section">
        <Text className="section-title">现在的反思</Text>
        <Text className="section-content">{diary.reflection}</Text>
      </View>

      <View className="detail-footer">
        <Text className="footer-info">
          👍 {diary.likes} 💬 {diary.comments} 📤 {diary.shares}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DiaryDetailPage;
