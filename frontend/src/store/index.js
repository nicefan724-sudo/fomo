/**
 * 前端状态管理（使用Zustand）
 * 存储用户信息、token、日记列表等全局状态
 */

import { create } from 'zustand';
import Taro from '@tarojs/taro';

export const useAuthStore = create((set, get) => ({
  // 状态
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,

  // 初始化：从本地存储恢复
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      const tokenRes = await Taro.getStorage({ key: 'jomo_token' }).catch(() => null);
      const userRes = await Taro.getStorage({ key: 'jomo_user' }).catch(() => null);

      if (tokenRes?.data && userRes?.data) {
        set({
          token: tokenRes.data,
          user: JSON.parse(userRes.data),
          isLoggedIn: true
        });
      }
    } catch (error) {
      console.error('初始化认证失败:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 设置认证信息
  setAuth: async (token, user) => {
    try {
      await Taro.setStorage({ key: 'jomo_token', data: token });
      await Taro.setStorage({ key: 'jomo_user', data: JSON.stringify(user) });
      
      set({
        token,
        user,
        isLoggedIn: true
      });
    } catch (error) {
      console.error('保存认证信息失败:', error);
    }
  },

  // 登出
  logout: async () => {
    try {
      await Taro.removeStorage({ key: 'jomo_token' });
      await Taro.removeStorage({ key: 'jomo_user' });
      
      set({
        user: null,
        token: null,
        isLoggedIn: false
      });

      Taro.reLaunch({ url: '/pages/login/index' });
    } catch (error) {
      console.error('登出失败:', error);
    }
  },

  // 更新用户信息
  updateUser: (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    
    set({ user: updatedUser });
    Taro.setStorage({ 
      key: 'jomo_user', 
      data: JSON.stringify(updatedUser) 
    });
  }
}));

// 日记列表状态
export const useDiaryStore = create((set) => ({
  diaries: [],
  total: 0,
  currentPage: 1,
  isLoading: false,
  selectedCategory: 'all',

  // 设置日记列表
  setDiaries: (diaries, total, page) => {
    set({
      diaries,
      total,
      currentPage: page
    });
  },

  // 添加日记
  addDiary: (diary) => {
    set((state) => ({
      diaries: [diary, ...state.diaries],
      total: state.total + 1
    }));
  },

  // 删除日记
  removeDiary: (id) => {
    set((state) => ({
      diaries: state.diaries.filter(d => d._id !== id),
      total: state.total - 1
    }));
  },

  // 更新日记
  updateDiary: (id, updatedData) => {
    set((state) => ({
      diaries: state.diaries.map(d => 
        d._id === id ? { ...d, ...updatedData } : d
      )
    }));
  },

  // 设置加载状态
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // 设置分类过滤
  setCategory: (category) => {
    set({ selectedCategory: category, currentPage: 1 });
  },

  // 清空日记列表
  clearDiaries: () => {
    set({
      diaries: [],
      total: 0,
      currentPage: 1
    });
  }
}));
