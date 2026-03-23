/**
 * 微信登录工具函数
 */

import Taro from '@tarojs/taro';
import apiClient from './api';
import { useAuthStore } from '../store';

export const wechatLogin = async () => {
  try {
    // 1. 获取微信登录code
    const { code } = await Taro.login();

    if (!code) {
      throw new Error('获取登录code失败');
    }

    // 2. 获取客户端信息（可选，用于登录日志）
    const clientInfo = Taro.getSystemInfoSync();

    // 3. 发送code到后端进行验证
    const response = await apiClient.post('/auth/wechat-login', {
      code,
      clientInfo: {
        model: clientInfo?.model || '',
        system: clientInfo?.system || ''
      }
    });

    if (!response.success) {
      throw new Error(response.message || '登录失败');
    }

    // 4. 保存token和用户信息到状态管理
    const { token, user } = response.data;
    await useAuthStore.getState().setAuth(token, user);

    // 5. 跳转到首页（home 是 TabBar 页，必须用 switchTab）
    await Taro.switchTab({ url: '/pages/home/index' });

    return { success: true, data: user };
  } catch (error) {
    console.error('微信登录错误:', error);
    
    let errorMessage = '登录失败，请重试';
    if (error.message === '获取登录code失败') {
      errorMessage = '获取登录信息失败，请检查微信权限';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/auth/me');

    if (response.success) {
      useAuthStore.getState().updateUser(response.data);
      return response.data;
    }

    throw new Error('获取用户信息失败');
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return null;
  }
};
