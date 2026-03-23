/**
 * 日记编辑页面 (A2 任务 - 日记编辑UI)
 */

import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Textarea, Input, Slider, Button, RadioGroup, Label, Radio, ScrollView } from '@tarojs/components';
import apiClient from '../../utils/api';
import { useDiaryStore } from '../../store';
import './index.scss';

const DiaryEditPage = () => {
  const route = Taro.useRouter();
  const { updateDiary, addDiary } = useDiaryStore();
  
  // 编辑状态
  const isEdit = !!route.params?.id;
  const diaryId = route.params?.id;

  // 表单状态
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'other',
    anxietyScore: 5,
    reflection: '',
    privacy: 'private',
    isAnonymous: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 加载日记详情（编辑模式）
  useEffect(() => {
    if (isEdit && diaryId) {
      loadDiary();
    }
  }, [isEdit, diaryId]);

  const loadDiary = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/diaries/${diaryId}`);
      
      if (response.success) {
        setForm(response.data);
      }
    } catch (error) {
      Taro.showToast({ title: '加载日记失败', icon: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    if (!form.title || form.title.length < 10) {
      newErrors.title = '标题至少需要10个字';
    }
    if (form.title.length > 100) {
      newErrors.title = '标题不超过100个字';
    }

    if (!form.content || form.content.length < 50) {
      newErrors.content = '内容至少需要50个字';
    }
    if (form.content.length > 5000) {
      newErrors.content = '内容不超过5000个字';
    }

    if (!form.reflection || form.reflection.length < 20) {
      newErrors.reflection = '"现在获得了什么？"至少需要20个字';
    }
    if (form.reflection.length > 2000) {
      newErrors.reflection = '反思不超过2000个字';
    }

    if (form.anxietyScore < 1 || form.anxietyScore > 10) {
      newErrors.anxietyScore = '焦虑指数需要在1-10之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      Taro.showToast({ title: '请检查表单', icon: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      
      if (isEdit) {
        // 更新日记
        const response = await apiClient.put(`/diaries/${diaryId}`, form);
        if (response.success) {
          updateDiary(diaryId, form);
          Taro.showToast({ title: '日记更新成功', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      } else {
        // 创建新日记
        const response = await apiClient.post('/diaries', form);
        if (response.success) {
          addDiary(response.data);
          Taro.showToast({ title: '日记创建成功', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 1500);
        }
      }
    } catch (error) {
      Taro.showToast({ title: '保存失败，请重试', icon: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // 保存草稿（可选功能）
  const handleSaveDraft = () => {
    Taro.setStorage({
      key: 'diary_draft',
      data: JSON.stringify(form)
    });
    Taro.showToast({ title: '草稿已保存', icon: 'success' });
  };

  return (
    <ScrollView className="diary-edit-container" scrollY>
      <View className="diary-form">
        {/* 标题 */}
        <View className="form-group">
          <Label className="form-label">
            日记标题 <Text className="required">*</Text>
          </Label>
          <Input
            className="form-input"
            placeholder="例：没去朋友聚会"
            value={form.title}
            maxlength={100}
            onInput={(e) => setForm({ ...form, title: e.detail.value })}
          />
          <View className="input-counter">
            {form.title.length}/100
          </View>
          {errors.title && <Text className="error-msg">{errors.title}</Text>}
        </View>

        {/* 内容 */}
        <View className="form-group">
          <Label className="form-label">
            发生了什么？ <Text className="required">*</Text>
          </Label>
          <Textarea
            className="form-textarea"
            placeholder="详细描述你当时面临的决定和心态..."
            value={form.content}
            maxlength={5000}
            onInput={(e) => setForm({ ...form, content: e.detail.value })}
          />
          <View className="input-counter">
            {form.content.length}/5000
          </View>
          {errors.content && <Text className="error-msg">{errors.content}</Text>}
        </View>

        {/* 分类 */}
        <View className="form-group">
          <Label className="form-label">分类</Label>
          <RadioGroup onChange={(e) => setForm({ ...form, category: e.detail.value })}>
            <View className="radio-group">
              <Label className="radio-item">
                <Radio value="social" checked={form.category === 'social'} />
                <Text>社交</Text>
              </Label>
              <Label className="radio-item">
                <Radio value="shopping" checked={form.category === 'shopping'} />
                <Text>购物</Text>
              </Label>
              <Label className="radio-item">
                <Radio value="career" checked={form.category === 'career'} />
                <Text>职业</Text>
              </Label>
              <Label className="radio-item">
                <Radio value="other" checked={form.category === 'other'} />
                <Text>其他</Text>
              </Label>
            </View>
          </RadioGroup>
        </View>

        {/* 焦虑指数 */}
        <View className="form-group">
          <Label className="form-label">
            当时的焦虑指数 <Text className="required">*</Text>
          </Label>
          <View className="anxiety-section">
            <Slider
              value={form.anxietyScore}
              min={1}
              max={10}
              onChange={(e) => setForm({ ...form, anxietyScore: e.detail.value })}
              className="anxiety-slider"
            />
            <View className="anxiety-value">
              <Text className="anxiety-number">{form.anxietyScore}</Text>
              <Text className="anxiety-label">/ 10</Text>
            </View>
          </View>
          <View className="anxiety-scale">
            <Text className="scale-left">不焦虑</Text>
            <Text className="scale-right">非常焦虑</Text>
          </View>
        </View>

        {/* 核心反思 */}
        <View className="form-group">
          <Label className="form-label">
            现在回看，获得了什么？ <Text className="required">*</Text>
          </Label>
          <Text className="form-hint">
            描述为什么这个"错过"其实是对的决定，或者你从中学到了什么
          </Text>
          <Textarea
            className="form-textarea"
            placeholder="例：意识到自己需要更多独处时间...或者省下了钱买了更想要的东西..."
            value={form.reflection}
            maxlength={2000}
            onInput={(e) => setForm({ ...form, reflection: e.detail.value })}
          />
          <View className="input-counter">
            {form.reflection.length}/2000
          </View>
          {errors.reflection && <Text className="error-msg">{errors.reflection}</Text>}
        </View>

        {/* 隐私设置 */}
        <View className="form-group">
          <Label className="form-label">隐私设置</Label>
          <RadioGroup onChange={(e) => setForm({ ...form, privacy: e.detail.value })}>
            <View className="radio-group privacy-group">
              <Label className="radio-item">
                <Radio value="private" checked={form.privacy === 'private'} />
                <View className="radio-text">
                  <Text className="radio-title">🔒 仅自己可见</Text>
                  <Text className="radio-desc">私密日记，不会分享</Text>
                </View>
              </Label>
              <Label className="radio-item">
                <Radio value="friends" checked={form.privacy === 'friends'} />
                <View className="radio-text">
                  <Text className="radio-title">👥 朋友可见</Text>
                  <Text className="radio-desc">仅你的朋友能看到</Text>
                </View>
              </Label>
              <Label className="radio-item">
                <Radio value="public" checked={form.privacy === 'public'} />
                <View className="radio-text">
                  <Text className="radio-title">🌐 全公开</Text>
                  <Text className="radio-desc">所有用户都能看到</Text>
                </View>
              </Label>
            </View>
          </RadioGroup>

          {/* 匿名选项 */}
          {form.privacy === 'public' && (
            <View className="anonymous-option">
              <Label className="checkbox-item">
                <Radio
                  value={form.isAnonymous}
                  checked={form.isAnonymous}
                  onChange={(e) => setForm({ ...form, isAnonymous: e.detail })}
                />
                <Text>匿名发布（不显示你的名字）</Text>
              </Label>
            </View>
          )}
        </View>

        {/* 按钮 */}
        <View className="form-actions">
          <Button
            className="btn btn-secondary"
            onClick={handleSaveDraft}
          >
            💾 保存草稿
          </Button>
          <Button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : isEdit ? '📝 更新日记' : '✨ 创建日记'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default DiaryEditPage;
