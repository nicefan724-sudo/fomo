const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 处理微信登录 (E1 任务)
 * 1. 接收小程序传来的 code
 * 2. 向微信API验证并获取 openid
 * 3. 创建或更新用户
 * 4. 生成JWT token返回前端
 */
exports.wechatLogin = async (req, res, next) => {
  try {
    const { code, clientInfo } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: '缺少登录 code'
      });
    }

    // 调用微信API验证code获取openid
    // 实际生产环境需要真实的微信凭证
    const wechatResponse = await exchangeCodeForOpenid(code);

    if (!wechatResponse || !wechatResponse.openid) {
      return res.status(401).json({
        success: false,
        message: '微信登录验证失败'
      });
    }

    const { openid, session_key } = wechatResponse;

    // 查找或创建用户
    let user = await User.findOne({ openid });

    if (!user) {
      // 新用户：创建账户
      user = new User({
        openid,
        nickname: `用户${Date.now().toString().slice(-6)}`,
        loginHistory: [
          {
            timestamp: new Date(),
            ip: req.ip,
            device: clientInfo?.model || '未知'
          }
        ]
      });
    } else {
      // 现有用户：更新登录信息
      user.lastLoginAt = new Date();
      user.lastLoginIp = req.ip;
      user.loginHistory.push({
        timestamp: new Date(),
        ip: req.ip,
        device: clientInfo?.model || '未知'
      });
      // 限制登录历史记录数量（只保留最近100条）
      if (user.loginHistory.length > 100) {
        user.loginHistory = user.loginHistory.slice(-100);
      }
    }

    await user.save();

    // 生成JWT token（有效期7天）
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        openid: user.openid
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // 返回token和用户基本信息
    return res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          openid: user.openid,
          nickname: user.nickname,
          avatar: user.avatar,
          isDataPublic: user.isDataPublic
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 刷新token
 * 前端token即将过期时调用此接口获取新token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const userId = req.userId;
    const openid = req.openid;

    if (!userId || !openid) {
      return res.status(401).json({
        success: false,
        message: '用户信息不完整'
      });
    }

    // 生成新的token
    const newToken = jwt.sign(
      {
        userId,
        openid
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Token刷新成功',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-loginHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 辅助函数：与微信API交互
 * 在实际生产环境中，需要替换为真实的微信凭证
 */
async function exchangeCodeForOpenid(code) {
  try {
    // 注意：这是示例代码，实际需要使用真实的微信AppID和AppSecret
    const appid = process.env.WECHAT_APP_ID;
    const secret = process.env.WECHAT_APP_SECRET;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    const response = await axios.get(url);

    if (response.data.errcode) {
      console.error('微信API错误:', response.data);
      return null;
    }

    return {
      openid: response.data.openid,
      session_key: response.data.session_key
    };
  } catch (error) {
    console.error('微信登录交互错误:', error.message);
    
    // 开发环境模拟返回值（便于本地测试）
    if (process.env.NODE_ENV === 'development') {
      return {
        openid: `dev_openid_${Date.now()}`,
        session_key: 'dev_session_key'
      };
    }

    return null;
  }
}

module.exports = exports;
