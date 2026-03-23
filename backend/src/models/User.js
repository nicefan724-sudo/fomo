const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * 用户数据模型
 * 存储用户信息和认证数据
 */
const userSchema = new mongoose.Schema(
  {
    // 微信登录信息
    openid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    // 用户信息
    nickname: {
      type: String,
      default: '匿名用户'
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 200,
      default: ''
    },
    // 账户设置
    isDataPublic: {
      type: Boolean,
      default: false // 默认不公开统计数据
    },
    isAnonymousDefault: {
      type: Boolean,
      default: false // 默认发布时是否匿名
    },
    // 统计数据
    totalDiaries: {
      type: Number,
      default: 0
    },
    // 账户状态
    status: {
      type: String,
      enum: ['active', 'deactivated', 'deleted'],
      default: 'active'
    },
    // 安全信息
    lastLoginAt: {
      type: Date,
      default: null
    },
    lastLoginIp: {
      type: String,
      default: ''
    },
    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        device: String
      }
    ],
    // 账户删除请求（需要48小时确认）
    deleteRequestedAt: {
      type: Date,
      default: null
    },
    // 时间戳
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// 虚拟字段：是否已请求删除且超过48小时
userSchema.virtual('canBeDeleted').get(function () {
  if (!this.deleteRequestedAt) return false;
  const now = new Date();
  const diffMs = now - this.deleteRequestedAt;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 48;
});

// 中间件：更新时间戳
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
