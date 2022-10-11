const path = require('path')
const { spawn } = require('child_process')
const electron = require('electron')
const webpack = require('webpack')
const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../app.config')

const mainWebpackConfig = require('./webpack.main')
const rendererWebpackConfig = require('./webpack.renderer')

function buildMain() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainWebpackConfig)

    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err)
      }
      if (stats.helloworld) {
        // 统计日志
        console.log(stats)
      }

      resolve(true)
    })
  })
}

function buildRenderer() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(rendererWebpackConfig)
    const devServerOptions = {
      ...rendererWebpackConfig.devServer,
      ...config.devServer
    }

    const server = new WebpackDevServer(devServerOptions, compiler)
    server.startCallback(() => {
      console.log(
        `Starting server on http://${devServerOptions.host}:${devServerOptions.port}`
      )
    })
    resolve(true)
  })
}

function startElectron() {
  const args = [path.resolve(process.cwd(), `${config.distOutPut}/main.js`)]
  const electronProcess = spawn(electron, args)

  electronProcess.on('close', () => {
    process.exit()
  })

  electronProcess.stdout.on('data', (data) => {
    console.log(chalk.blue('------ Electron info start ------'))
    console.log(chalk.blue(data))
    console.log(chalk.blue('------ Electron info end ------'))
  })
  electronProcess.stderr.on('data', (data) => {
    console.log(chalk.red('------ Electron error start ------'))
    console.log(chalk.red(data))
    console.log(chalk.red('------ Electron error end ------'))
  })
}

Promise.all([buildRenderer(), buildMain()])
  .then(() => {
    startElectron()
  })
  .catch((err) => {
    console.log(chalk.red(err))
  })
