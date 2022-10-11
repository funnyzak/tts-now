const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const config = require('../app.config')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    main: path.resolve(process.cwd(), 'src/background.ts')
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'], // tsconfig.json 设置 "target": "es6" ，再用 babel 转换一次
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        extensions: ['.ts', '.tsx']
      })
    ]
  },
  output: {
    path: path.resolve(process.cwd(), config.distOutPut),
    filename: 'main.js'
  },
  target: 'electron-main'
}
