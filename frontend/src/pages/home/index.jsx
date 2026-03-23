/**
 * 首页/日记列表页面 (A5 任务 - 日记列表展示)
 */

import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import apiClient from '../../utils/api';
import { useDiaryStore, useAuthStore } from '../../store';
import DiaryCard from '../../components/DiaryCard';
import BottomTabBar from '../../components/BottomTabBar';
import './index.scss';

const HomePage = () => {
  const { diaries, total, setDiaries, removeDiary, setLoading, isLoading, selectedCategory, setCategory } = useDiaryStore();
  const { isLoggedIn } = useAuthStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 登录态守卫：未登录跳到登录页
  useEffect(() => {
    if (!isLoggedIn) {
      Taro.reLaunch({ url: '/pages/login/index' });
    }
  }, [isLoggedIn]);

  // 初始化加载日记
  useEffect(() => {
    if (isLoggedIn) {
      loadDiaries(1);
    }
  }, [selectedCategory, isLoggedIn]);

  // 加载日记列表
  const loadDiaries = async (page = 1) => {
    try {
      setLoading(true);
      
      const response = await apiClient.get('/diaries', {
        params: {
          page,
          limit: 10,
          category: selectedCategory === 'all' ? undefined : selectedCategory
        }
      });

      if (response.success) {
        setDiaries(response.data.diaries, response.data.pagination.total, page);
        setCurrentPage(page);
      }
    } catch (error) {
      Taro.showToast({ title: '加载日记失败', icon: 'error' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 下拉刷新
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDiaries(1);
  };

  // 上拉加载更多
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    loadDiaries(nextPage);
  };

  // 删除日记
  const handleDeleteDiary = async (id) => {
    try {
      const confirm = await Taro.showModal({
        title: '删除日记',
        content: '确定要删除这篇日记吗？',
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#e74c3c'
      });

      if (confirm.confirm) {
        const response = await apiClient.delete(`/diaries/${id}`);
        if (response.success) {
          removeDiary(id);
          Taro.showToast({ title: '日记已删除', icon: 'success' });
        }
      }
    } catch (error) {
      Taro.showToast({ title: '删除失败', icon: 'error' });
    }
  };

  // 新建日记
  const handleNewDiary = () => {
    Taro.navigateTo({ url: '/pages/diaryEdit/index' });
  };

  // 统计数据
  const getCategoryStats = () => {
    const stats = {
      total: diaries.length,
      social: 0,
      shopping: 0,
      career: 0,
      other: 0
    };

    diaries.forEach(diary => {
      if (diary.category === 'social') stats.social++;
      else if (diary.category === 'shopping') stats.shopping++;
      else if (diary.category === 'career') stats.career++;
      else stats.other++;
    });

    return stats;
  };

  const stats = getCategoryStats();

  return (
    <View className="home-container">
      {/* 顶部导航 */}
      <View className="home-header">
        <View className="header-top">
          <Text className="header-title">JOMO日记</Text>
          <Button
            className="new-diary-btn"
            onClick={handleNewDiary}
          >
            + 新建
          </Button>
        </View>

        {/* 统计信息 */}
        <View className="stats-section">
          <Text className="stats-text">
            已记录 <Text className="stats-number">{total}</Text> 篇日记
          </Text>
        </View>
      </View>

      {/* 分类筛选 */}
      <View className="category-filter">
        <View
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          全部
        </View>
        <View
          className={`category-btn ${selectedCategory === 'social' ? 'active' : ''}`}
          onClick={() => setCategory('social')}
        >
          💬 社交 ({stats.social})
        </View>
        <View
          className={`category-btn ${selectedCategory === 'shopping' ? 'active' : ''}`}
          onClick={() => setCategory('shopping')}
        >
          🛍️ 购物 ({stats.shopping})
        </View>
        <View
          className={`category-btn ${selectedCategory === 'career' ? 'active' : ''}`}
          onClick={() => setCategory('career')}
        >
          💼 职业 ({stats.career})
        </View>
        <View
          className={`category-btn ${selectedCategory === 'other' ? 'active' : ''}`}
          onClick={() => setCategory('other')}
        >
          ✨ 其他 ({stats.other})
        </View>
      </View>

      {/* 日记列表 */}
      <ScrollView
        className="diary-list"
        scrollY
        onRefresherRefresh={handleRefresh}
        refresherEnabled
        refresherTriggered={isRefreshing}
        onReachBottomDistance={100}
        onReachBottom={handleLoadMore}
      >
        {diaries.length > 0 ? (
          <>
            {diaries.map((diary) => (
              <DiaryCard
                key={diary._id}
                diary={diary}
                onDelete={handleDeleteDiary}
              />
            ))}

            {/* 加载状态 */}
            {isLoading && (
              <View className="loading-state">
                <Text>加载中...</Text>
              </View>
            )}

            {/* 没有更多 */}
            {total > 0 && diaries.length >= total && (
              <View className="end-state">
                <Text>没有更多日记了</Text>
              </View>
            )}
          </>
        ) : (
          <View className="empty-state">
            <Text className="empty-icon">📝</Text>
            <Text className="empty-title">还没有日记</Text>
            <Text className="empty-text">
              点击上面的"+ 新建"按钮，开始记录你的JOMO故事吧
            </Text>
            <Button
              className="empty-btn"
              onClick={handleNewDiary}
            >
              现在就开始
            </Button>
          </View>
        )}
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomTabBar active="home" />
    </View>
  );
};

export default HomePage;
