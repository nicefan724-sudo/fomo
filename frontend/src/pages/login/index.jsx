/**
 * 登录页面 (E1 任务 - 微信登录集成)
 */

import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Button, View, Image, Text } from '@tarojs/components';
import { wechatLogin } from '../../utils/auth';
import { useAuthStore } from '../../store';
import './index.scss';

const LoginPage = () => {
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 如果已登录，重定向到首页
    if (isLoggedIn) {
      Taro.switchTab({ url: '/pages/home/index' });
    }
  }, [isLoggedIn]);

  const handleWechatLogin = async () => {
    const result = await wechatLogin();
    
    if (!result.success) {
      Taro.showToast({
        title: result.error || '登录失败',
        icon: 'error',
        duration: 2000
      });
    }
  };

  return (
    <View className="login-container">
      {/* 顶部装饰 */}
      <View className="login-header">
        <Text className="login-title">JOMO日记</Text>
        <Text className="login-subtitle">
          记录"错过但无悔"的时刻
        </Text>
      </View>

      {/* 主要内容 */}
      <View className="login-content">
        <View className="intro-section">
          <Text className="intro-text">
            📝 记录每一次的焦虑与反思
          </Text>
          <Text className="intro-text">
            📊 通过数据看到自己的成长
          </Text>
          <Text className="intro-text">
            🌐 与朋友分享JOMO故事
          </Text>
          <Text className="intro-text">
            👥 找到反FOMO的同伴
          </Text>
        </View>

        {/* 登录按钮 */}
        <View className="login-button-section">
          <Button
            className="wechat-login-btn"
            onClick={handleWechatLogin}
          >
            👉 微信一键登录
          </Button>

          <Text className="login-tips">
            我们承诺尊重隐私，不会分享你的个人信息
          </Text>
        </View>
      </View>

      {/* 底部信息 */}
      <View className="login-footer">
        <Text className="footer-text">
          JOMO = Joy of Missing Out
        </Text>
        <Text className="footer-text">
          v1.0.0 Beta
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
