const jwt = require('jsonwebtoken');

/**
 * 验证用户认证中间件
 * 检查JWT token的有效性
 */
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.openid = decoded.openid;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '认证令牌无效或已过期',
      error: error.message
    });
  }
};

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MongoDB验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: messages
    });
  }

  // MongoDB重复键错误
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '记录已存在'
    });
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token无效'
    });
  }

  return res.status(500).json({
    success: false,
    message: '服务器错误',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
};

module.exports = {
  authenticate,
  errorHandler
};
