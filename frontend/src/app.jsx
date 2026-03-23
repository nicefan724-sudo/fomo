/**
 * 小程序入口文件
 * 注意：onLaunch / onShow 里不能做路由跳转（页面栈尚未建立）
 * 登录态检查统一在 home 页面的 useEffect 里处理
 */

import React from 'react';
import { useAuthStore } from './store';

const App = ({ children }) => {
  return children;
};

// 仅做数据初始化，不做任何路由跳转
App.onLaunch = async () => {
  await useAuthStore.getState().initializeAuth();
};

export default App;
