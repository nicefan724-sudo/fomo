/**
 * 前端API请求配置和HTTP客户端
 */

import axios from 'axios';
import Taro from '@tarojs/taro';

// API基础URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://jomo-diary.com/api' 
  : 'http://localhost:5000/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：添加认证token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await Taro.getStorage({ key: 'jomo_token' })
        .then(res => res.data)
        .catch(() => null);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('获取token失败:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误和token过期
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token过期，尝试刷新
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
        if (response.data.success) {
          await Taro.setStorage({
            key: 'jomo_token',
            data: response.data.data.token
          });
          // 重试原请求
          return apiClient(error.config);
        }
      } catch (refreshError) {
        // 刷新失败，返回登录页
        await Taro.setStorage({ key: 'jomo_token', data: '' });
        Taro.redirectTo({ url: '/pages/login/index' });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
