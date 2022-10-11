const Webpack = require('webpack')
const path = require('path')
const { delDirPath } = require('./utils')

const mainWebpackConfig = require('./webpack.main')
const rendererWebpackConfig = require('./webpack.renderer')

const config = require('../app.config')

// 不输出调试map
delete rendererWebpackConfig.devtool

function buildMain() {
  return new Promise((resolve, reject) => {
    const compiler = Webpack(mainWebpackConfig)
    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err)
      }
      console.log('main process:', stats)
      resolve()
    })
  })
}
function buildRenderer() {
  return new Promise((resolve, reject) => {
    const compiler = Webpack(rendererWebpackConfig)
    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err)
      }
      console.log('renderer process:', stats)
      resolve()
    })
  })
}

function main() {
  delDirPath(path.resolve(__dirname, `../${config.distOutPut}`))

  Promise.all([buildMain(), buildRenderer()]).then(() => {
    console.log('build app done.')
    process.exit()
  })
}

main()
