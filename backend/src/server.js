require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/auth');

// 导入路由
const authRoutes = require('./routes/auth');
const diariesRoutes = require('./routes/diaries');

// 初始化Express应用
const app = express();

// 中间件配置
app.use(helmet()); // 安全头设置
app.use(cors()); // 跨域支持
app.use(morgan('combined')); // 请求日志
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL编码解析

// 数据库连接
connectDB();

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/diaries', diariesRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JOMO日记后端服务运行中',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理中间件（必须在最后）
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   JOMO日记 - 后端服务已启动            ║
║   Server: http://localhost:${PORT}         ║
║   Environment: ${process.env.NODE_ENV || 'development'}       ║
╚════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM信号收到，关闭服务器');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

module.exports = app;
