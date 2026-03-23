const mongoose = require('mongoose');

let memoryServer = null;

/**
 * 连接到MongoDB数据库
 * - 开发环境：优先使用内存数据库（无需安装MongoDB）
 * - 生产环境：使用 MONGODB_URI 环境变量
 */
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // 如果没有配置真实URI，或者URI还是占位符，则使用内存数据库
    const isPlaceholder = !uri || uri.includes('替换为你的');
    
    if (isPlaceholder) {
      console.log('⚠️  未配置 MONGODB_URI，启动内存数据库（测试模式）...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('🧪 内存数据库已启动:', uri);
    }

    await mongoose.connect(uri);
    console.log('✅ MongoDB 连接成功');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('✅ MongoDB 已断开连接');
  } catch (error) {
    console.error('❌ MongoDB 断开连接失败:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
