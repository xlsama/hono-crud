import http from 'k6/http'

// 测试配置
export const options = {
  // 测试场景
  scenarios: {
    // 恒定负载测试
    constant_load: {
      executor: 'constant-vus',
      vus: 100, // 虚拟用户数
      duration: '30s', // 持续时间
    },
  },
}

// 测试的目标 URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // 测试获取所有 todos
  http.get(`${BASE_URL}/`)
}
