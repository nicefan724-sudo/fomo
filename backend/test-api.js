/**
 * JOMO 后端接口测试脚本
 * 运行方式: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 开始 JOMO API 测试...\n');
  let pass = 0, fail = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      pass++;
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
      fail++;
    }
  }

  // 测试 1: 健康检查
  await test('GET /health - 服务器健康检查', async () => {
    const res = await request('/health');
    if (res.status !== 200) throw new Error(`状态码 ${res.status}`);
    if (!res.body.success) throw new Error('success 字段应为 true');
    console.log(`     ↳ 响应: ${res.body.message}`);
  });

  // 测试 2: 404 处理
  await test('GET /不存在的路由 - 404处理', async () => {
    const res = await request('/api/nonexistent');
    if (res.status !== 404) throw new Error(`期望 404，实际 ${res.status}`);
  });

  // 测试 3: 未授权访问日记接口
  await test('GET /api/diaries - 无Token应返回401', async () => {
    const res = await request('/api/diaries');
    if (res.status !== 401) throw new Error(`期望 401，实际 ${res.status}`);
  });

  // 测试 4: 微信登录参数校验
  await test('POST /api/auth/wechat-login - 缺少code应返回400/422', async () => {
    const res = await request('/api/auth/wechat-login', 'POST', {});
    if (![400, 422, 500].includes(res.status)) throw new Error(`期望 4xx，实际 ${res.status}`);
  });

  console.log(`\n📊 测试结果: ${pass} 通过 / ${fail} 失败\n`);
  if (fail === 0) {
    console.log('🎉 所有测试通过！后端服务运行正常\n');
  } else {
    console.log('⚠️  有部分测试失败，请检查服务器状态\n');
  }
}

runTests().catch(err => {
  console.error('\n❌ 无法连接到服务器:', err.message);
  console.error('请确认后端服务器已启动: cd backend && node src/server.js\n');
  process.exit(1);
});
