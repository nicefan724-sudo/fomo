const mongoose = require('mongoose');

/**
 * 连接到MongoDB数据库
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jomo-diary';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB 连接成功:', uri);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB 断开连接');
  } catch (error) {
    console.error('❌ MongoDB 断开连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
