/**
 * 前端API请求配置
 * 使用 Taro.request 代替 axios（小程序环境不支持 axios）
 */

import Taro from '@tarojs/taro';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://jomo-diary.com/api'
  : 'http://localhost:5000/api';

// 获取本地存储的 token
const getToken = async () => {
  try {
    const res = await Taro.getStorage({ key: 'jomo_token' });
    return res.data || null;
  } catch {
    return null;
  }
};

// 统一请求方法
const request = async (method, path, data = null, params = null) => {
  const token = await getToken();

  const url = params
    ? `${API_BASE_URL}${path}?${new URLSearchParams(params).toString()}`
    : `${API_BASE_URL}${path}`;

  const header = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 401) {
          // token 过期，跳转到登录页
          Taro.removeStorage({ key: 'jomo_token' });
          Taro.redirectTo({ url: '/pages/login/index' });
          reject(new Error('未授权，请重新登录'));
        } else if (res.statusCode >= 400) {
          reject(res.data);
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

// 封装常用方法
const apiClient = {
  get: (path, options = {}) => request('GET', path, null, options.params),
  post: (path, data) => request('POST', path, data),
  put: (path, data) => request('PUT', path, data),
  delete: (path) => request('DELETE', path)
};

export default apiClient;
