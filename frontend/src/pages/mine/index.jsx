import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAuthStore } from '../../store';
import BottomTabBar from '../../components/BottomTabBar';
import './index.scss';

/**
 * 我的页面 (E4 任务的一部分)
 */
const MinePage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const confirm = await Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消'
    });

    if (confirm.confirm) {
      await logout();
    }
  };

  return (
    <View className="mine-container">
      {/* 用户信息卡片 */}
      <View className="user-card">
        <View className="user-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" />
          ) : (
            <Text className="avatar-placeholder">👤</Text>
          )}
        </View>
        <View className="user-info">
          <Text className="user-nickname">{user?.nickname || '匿名用户'}</Text>
          <Text className="user-bio">{user?.bio || '暂无个人介绍'}</Text>
        </View>
      </View>

      {/* 菜单项 */}
      <View className="menu-section">
        <View className="menu-item">
          <Text className="menu-icon">✏️</Text>
          <Text className="menu-label">编辑资料</Text>
          <Text className="menu-arrow">›</Text>
        </View>

        <View className="menu-item">
          <Text className="menu-icon">⚙️</Text>
          <Text className="menu-label">设置</Text>
          <Text className="menu-arrow">›</Text>
        </View>

        <View className="menu-item">
          <Text className="menu-icon">ℹ️</Text>
          <Text className="menu-label">关于</Text>
          <Text className="menu-arrow">›</Text>
        </View>
      </View>

      {/* 登出按钮 */}
      <View className="logout-section">
        <Button
          className="logout-btn"
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </View>

      {/* 版本信息 */}
      <View className="footer">
        <Text className="version">v1.0.0 Beta</Text>
        <Text className="copyright">© 2026 JOMO日记</Text>
      </View>

      <BottomTabBar active="mine" />
    </View>
  );
};

export default MinePage;
