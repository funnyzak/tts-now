// document https://babel.docschina.org/docs/en/7.0.0/configuration/
module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        // polyfill 操作方式
        useBuiltIns: 'usage',
        // 声明corejs版本
        corejs: '3'
      }
    ]
  ]
  const plugins = []

  return {
    presets,
    plugins
  }
}
