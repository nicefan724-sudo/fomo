const Diary = require('../models/Diary');
const User = require('../models/User');

/**
 * 创建新日记 (A3 任务)
 * POST /api/diaries
 */
exports.createDiary = async (req, res, next) => {
  try {
    const { title, content, category, anxietyScore, reflection, privacy, isAnonymous } = req.body;
    const userId = req.userId;

    // 数据验证（Joi应该在路由层做，这里做备用验证）
    const errors = [];
    if (!title || title.length < 10) errors.push('标题至少需要10个字');
    if (!content || content.length < 50) errors.push('内容至少需要50个字');
    if (!reflection || reflection.length < 20) errors.push('反思至少20个字');
    if (anxietyScore < 1 || anxietyScore > 10) errors.push('焦虑指数需要在1-10之间');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors
      });
    }

    // 创建日记
    const diary = new Diary({
      userId,
      title,
      content,
      category: category || 'other',
      anxietyScore: parseInt(anxietyScore),
      reflection,
      privacy: privacy || 'private',
      isAnonymous: isAnonymous && privacy === 'public' // 仅当公开时才支持匿名
    });

    await diary.save();

    // 更新用户的日记总数
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalDiaries: 1 } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: '日记创建成功',
      data: diary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新日记 (A3 任务)
 * PUT /api/diaries/:id
 */
exports.updateDiary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, content, category, anxietyScore, reflection, privacy, isAnonymous } = req.body;

    // 查找日记
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    // 权限检查：只能编辑自己的日记
    if (diary.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权编辑他人日记'
      });
    }

    // 更新允许的字段
    if (title) diary.title = title;
    if (content) diary.content = content;
    if (category) diary.category = category;
    if (anxietyScore) diary.anxietyScore = anxietyScore;
    if (reflection) diary.reflection = reflection;
    if (privacy) diary.privacy = privacy;
    if (isAnonymous !== undefined) diary.isAnonymous = isAnonymous && privacy === 'public';

    await diary.save();

    return res.status(200).json({
      success: true,
      message: '日记更新成功',
      data: diary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户日记列表 (A4 任务)
 * GET /api/diaries?page=1&limit=10&category=social&sort=newest
 */
exports.getDiaries = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, category, sort = 'newest' } = req.query;

    // 构建查询条件
    const query = { userId };
    if (category && category !== 'all') {
      query.category = category;
    }

    // 构建排序条件
    let sortOption = { createdAt: -1 }; // 默认最新优先
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    // 分页计算
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // 查询日记
    const diaries = await Diary.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // 获取总数
    const total = await Diary.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        diaries,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单条日记详情 (A4 任务)
 * GET /api/diaries/:id
 */
exports.getDiaryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    // 权限检查：只能查看自己的日记或别人公开的日记
    const isOwner = diary.userId.toString() === userId;
    const isPublic = diary.privacy === 'public';

    if (!isOwner && !isPublic) {
      return res.status(403).json({
        success: false,
        message: '无权查看此日记'
      });
    }

    return res.status(200).json({
      success: true,
      data: diary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除日记
 * DELETE /api/diaries/:id
 */
exports.deleteDiary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: '日记不存在'
      });
    }

    // 权限检查
    if (diary.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权删除他人日记'
      });
    }

    await Diary.findByIdAndDelete(id);

    // 更新用户的日记总数
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalDiaries: -1 } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: '日记删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
