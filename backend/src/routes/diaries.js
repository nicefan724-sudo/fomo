const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const { authenticate } = require('../middleware/auth');

/**
 * 日记路由
 * 所有日记操作需要用户认证
 */

// 创建新日记
router.post('/', authenticate, diaryController.createDiary);

// 获取用户日记列表
router.get('/', authenticate, diaryController.getDiaries);

// 获取单条日记详情
router.get('/:id', authenticate, diaryController.getDiaryById);

// 更新日记
router.put('/:id', authenticate, diaryController.updateDiary);

// 删除日记
router.delete('/:id', authenticate, diaryController.deleteDiary);

module.exports = router;
