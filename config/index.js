// webpack devServer 配置
const devServiceConfig = {
  host: '127.0.0.1',
  client: {
    overlay: true
  },
  port: 2085,
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
};

module.exports = {
  devServiceConfig,

  // 源打包输出路径
  distOutPutPath: 'dist'
};
