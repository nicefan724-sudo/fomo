/**
 * 小程序入口文件
 */

import React, { useEffect } from 'react';
import { useAuthStore } from './store';

const App = () => {
  useEffect(() => {
    // 初始化认证信息
    useAuthStore.getState().initializeAuth();
  }, []);

  return null;
};

export default App;
