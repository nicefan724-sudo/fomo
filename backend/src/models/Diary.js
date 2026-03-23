const mongoose = require('mongoose');

/**
 * 日记数据模型
 * 用于存储用户的JOMO日记记录
 */
const diarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // 基本信息
    title: {
      type: String,
      required: [true, '日记标题必填'],
      minlength: [10, '标题至少需要10个字'],
      maxlength: [100, '标题不超过100个字'],
      trim: true
    },
    content: {
      type: String,
      required: [true, '日记内容必填'],
      minlength: [50, '内容至少需要50个字'],
      maxlength: [5000, '内容不超过5000个字']
    },
    // 分类标签
    category: {
      type: String,
      enum: ['social', 'shopping', 'career', 'other'],
      default: 'other'
    },
    // 当时的焦虑指数 (1-10)
    anxietyScore: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, '焦虑指数必填']
    },
    // 现在的评价：错过这件事获得了什么？
    reflection: {
      type: String,
      required: [true, '反思评价必填'],
      minlength: [20, '反思至少20个字'],
      maxlength: [2000, '反思不超过2000个字']
    },
    // 隐私设置
    privacy: {
      type: String,
      enum: ['private', 'friends', 'public'],
      default: 'private',
      index: true
    },
    // 是否匿名发布（仅当设为public时有效）
    isAnonymous: {
      type: Boolean,
      default: false
    },
    // 统计数据
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    // 时间戳
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 索引优化
diarySchema.index({ userId: 1, createdAt: -1 });
diarySchema.index({ userId: 1, category: 1, createdAt: -1 });
diarySchema.index({ privacy: 1, createdAt: -1 });

// 虚拟字段：是否为今天创建
diarySchema.virtual('isToday').get(function () {
  const today = new Date();
  return (
    this.createdAt.getFullYear() === today.getFullYear() &&
    this.createdAt.getMonth() === today.getMonth() &&
    this.createdAt.getDate() === today.getDate()
  );
});

// 中间件：更新时间戳
diarySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Diary', diarySchema);
