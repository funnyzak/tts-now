const appConfig = {
  appName: 'TTS Now',
  // 源打包输出
  distOutPut: 'build/bundle',
  // 开发环境 服务配置
  devServer: {
    host: '127.0.0.1',
    client: {
      overlay: true
    },
    port: 2090,
    // 代理设置
    proxy: {
      // example: /api/login => http://localhost:3000/login
      // '/api': {
      //   target: 'http://localhost:3000',
      //   pathRewrite: { '^/api': '' },
      // },
      // example: /api2/login => http://localhost:3000/api2/login
      // '/api2': 'http://localhost:3001',
    }
  }
}

module.exports = appConfig
