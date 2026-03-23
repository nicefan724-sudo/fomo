# JOMO日记 - 反FOMO微信小程序

> 记录"错过但无悔"的时刻，重塑对FOMO的认知

## 📋 项目介绍

**JOMO日记** 是一款反FOMO微信小程序，帮助年轻人通过记录和反思，重建对"错过"事件的正面认知。

**核心理念**：当你面临"是否要参加聚会""是否要买这件衣服"等决定时，记录当时的焦虑程度和最终的选择。数周后回看这些记录，会发现"我当时以为错过了什么，现在看来并没什么损失"。

## 🎯 核心功能（Sprint 1 MVP）

✅ **微信登录** — 一键登录，安全认证  
✅ **日记记录** — 记录标题、内容、焦虑指数、反思  
✅ **日记管理** — 查看、编辑、删除日记  
✅ **分类和筛选** — 按类型（社交/购物/职业/其他）管理  
✅ **底部导航** — 4个Tab：首页、统计、社区、我的  

## 🏗️ 项目结构

```
jomo-app/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── server.js          # 入口文件
│   │   ├── models/            # 数据模型
│   │   │   ├── User.js
│   │   │   └── Diary.js
│   │   ├── controllers/       # 业务逻辑
│   │   │   ├── authController.js
│   │   │   └── diaryController.js
│   │   ├── routes/            # API路由
│   │   │   ├── auth.js
│   │   │   └── diaries.js
│   │   ├── middleware/        # 中间件
│   │   │   └── auth.js
│   │   └── config/            # 配置
│   │       └── database.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # 前端（Taro + React）
│   ├── src/
│   │   ├── app.jsx            # 入口
│   │   ├── pages/             # 页面
│   │   │   ├── login/         # 登录页
│   │   │   ├── home/          # 首页/日记列表
│   │   │   ├── diaryEdit/     # 日记编辑
│   │   │   ├── diaryDetail/   # 日记详情
│   │   │   ├── statistics/    # 统计（占位符）
│   │   │   ├── community/     # 社区（占位符）
│   │   │   └── mine/          # 我的
│   │   ├── components/        # 组件
│   │   │   ├── DiaryCard/
│   │   │   └── BottomTabBar/
│   │   ├── store/             # 状态管理（Zustand）
│   │   │   └── index.js
│   │   └── utils/             # 工具函数
│   │       ├── api.js         # HTTP客户端
│   │       └── auth.js        # 认证工具
│   ├── config/                # Taro配置
│   ├── package.json
│   └── project.config.json
│
└── package.json              # 根目录配置
```

## ⚡ 快速开始

### 环境要求

- Node.js >= 14
- MongoDB >= 4.0（或使用本地测试数据库）
- 微信小程序开发者工具
- npm 或 yarn

### 1️⃣ 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置

# 启动开发服务器
npm run dev
```

服务器将运行在 `http://localhost:5000`

### 2️⃣ 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 编译微信小程序（开发模式）
npm run dev:weapp
```

编译产物在 `frontend/dist/weapp`

### 3️⃣ 微信开发者工具

1. 打开微信开发者工具
2. 新建项目，选择 `frontend/dist/weapp` 作为项目目录
3. 填入你的微信小程序AppID
4. 开启实时预览和自动编译

## 📝 API 文档（Sprint 1）

### 认证 API

#### 微信登录
```
POST /api/auth/wechat-login
Content-Type: application/json

Body:
{
  "code": "wx_code_from_client",
  "clientInfo": {
    "model": "iPhone 14",
    "system": "iOS 16"
  }
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "openid": "wx_openid",
      "nickname": "用户昵称",
      "avatar": "avatar_url",
      "isDataPublic": false
    }
  }
}
```

#### 刷新 Token
```
POST /api/auth/refresh-token
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "token": "new_jwt_token"
  }
}
```

#### 获取当前用户
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { user_object }
}
```

### 日记 API

#### 创建日记
```
POST /api/diaries
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "没去朋友聚会",
  "content": "详细描述...",
  "category": "social",
  "anxietyScore": 7,
  "reflection": "现在看来...",
  "privacy": "private"
}

Response:
{
  "success": true,
  "data": { diary_object }
}
```

#### 获取日记列表
```
GET /api/diaries?page=1&limit=10&category=social&sort=newest
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "diaries": [ diary_objects ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### 获取日记详情
```
GET /api/diaries/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { diary_object }
}
```

#### 更新日记
```
PUT /api/diaries/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body: { 要更新的字段 }

Response:
{
  "success": true,
  "data": { updated_diary_object }
}
```

#### 删除日记
```
DELETE /api/diaries/{id}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "日记删除成功"
}
```

## 🔐 环境变量配置

后端 `.env` 文件示例：

```env
# 服务器
PORT=5000
NODE_ENV=development

# 数据库
MONGODB_URI=mongodb://localhost:27017/jomo-diary

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# 微信
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 文件上传
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

## 🧪 测试

### 本地测试（开发环境）

后端会自动为不存在的微信openid生成虚拟数据，便于本地开发测试。

### API 测试（Postman）

1. 导入 Postman 集合（待补充）
2. 配置环境变量
3. 测试各个API端点

## 📦 部署

### 后端部署

1. **选择云服务器** — 推荐腾讯云、阿里云或AWS
2. **安装环境** — Node.js、MongoDB
3. **拉取代码** — Git clone
4. **配置环境变量** — 生产环境的微信凭证等
5. **启动服务** — 使用PM2等进程管理工具

### 小程序发布

1. 在微信开发者平台提交小程序审核
2. 等待审核通过
3. 发布到线上

## 🚀 下一步计划

- [ ] **Sprint 2**（第2周）— 数据统计、社区分享功能
- [ ] **Sprint 3**（第3周）— 朋友圈对标、安全设置、性能优化
- [ ] 内容审核和风控体系
- [ ] 推送通知功能
- [ ] Web 版本支持
- [ ] 数据分析报告

## 📞 支持

- 📧 邮箱: support@jomo-diary.com
- 🐛 Bug 报告: GitHub Issues
- 💡 功能建议: 欢迎讨论

## 📄 许可证

MIT License

---

**开发团队**: JOMO日记团队  
**最后更新**: 2026-03-23  
**当前版本**: v1.0.0 Beta
