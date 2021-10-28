const path = require('path');
const { spawn } = require('child_process');
const electron = require('electron');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../app.config');

const mainWebpackConfig = require('./webpack.main');
const rendererWebpackConfig = require('./webpack.renderer');

function buildMain() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainWebpackConfig);

    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.helloworld) {
        // 统计日志
        console.log(stats);
      }

      resolve();
    });
  });
}

function buildRenderer() {
  const compiler = webpack(rendererWebpackConfig);
  const devServerOptions = {
    ...rendererWebpackConfig.devServer,
    ...config.devServer
  };

  const server = new WebpackDevServer(devServerOptions, compiler);
  server.startCallback(() => {
    console.log(
      `Starting server on http://${devServerOptions.host}:${devServerOptions.port}`
    );
  });
}

function launch() {
  const args = [path.resolve(process.cwd(), `${config.distOutPut}/main.js`)];
  const mainProcess = spawn(electron, args);
  mainProcess.on('close', () => {
    process.exit();
  });
}

buildRenderer();
buildMain().then(() => {
  launch();
});
