# <img src="https://raw.githubusercontent.com/funnyzak/tts-now/master/public/icon/256x256.png" width="60px" align="center" alt="阿里云语音合成助手 icon"> 阿里云语音合成助手

应用基于阿里云语音合成 API 的语音合成助手。支持高达 99 种各种场景的语音合成，可单文本快速合成和批量语音合成。

编译版本支持 Windows32/64、Mac、Linux 版本。[点这里](https://github.com/funnyzak/tts-now/releases)可下载使用。

> 使用前需要到阿里云创建语音合成 AppKey，以及阿里云账号 API Key。点这里 => [直达注册](https://ai.aliyun.com/nls/tts)。

![合成演示](./public/_docs/assets/img/demo.gif)

---

## 构建

应用使用 Electron 并基于 React Typescript Webpack 构建。

> 使用的 Node 的构建版本为 **^14.17.5**，为避免冲突，建议使用此版本。可以使用 **_nvm_** 管理 Node 版本。

主要依赖库版本：

- electron: ^15.3.0
- electron-builder: ^22.13.15
- eslint: ^7.32.0
- babel: ^7.15.8
- css-loader: ^6.4.0
- less: ^4.1.2
- sass: ^6.0.1
- typescript: ^4.4.4
- webpack: ^5.59.1
- prettier: 2.4.1

### 目录

- `app.config.js`: app 基础配置
- `electron.builder.js`: 打包配置
- `public`：静态资源文件夹
- `config`：webpack 打包配置
- `src/background.ts`：electron main ，code here

### 命令

执行：`yarn install` or `npm install`，然后：

- 开发服务启动：`npm run serve`
- Lint 格式化：`npm run lint`
- 源构建输出：`npm run dist`
- 根据当前系统构建：`npm run build`
- 基于 dist 输出，根据当前系统构建：`npm run build:now`
- 构建 Windows 二进制：`npm run build:windows`
- 构建 Mac 二进制：`npm run build:mac`
- 构建 Linux 二进制：`npm run build:linux`

### 打包

- 源构建输出：`./build/bundle`
- 打包输出目录：`./build/binary`

---

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
