const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * 认证路由
 */

// 微信登录
router.post('/wechat-login', authController.wechatLogin);

// 刷新token（需要认证）
router.post('/refresh-token', authenticate, authController.refreshToken);

// 获取当前用户信息（需要认证）
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
