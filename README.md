# <img src="https://raw.githubusercontent.com/funnyzak/tts-now/master/public/icon/256x256.png" width="45" align="center" alt="云语音合成助手"> 云语音合成助手

[![Release Date](https://img.shields.io/github/release-date/funnyzak/tts-now.svg)](https://github.com/funnyzak/tts-now/releases/latest) [![Release Version](https://img.shields.io/github/release/funnyzak/tts-now.svg)](https://github.com/funnyzak/tts-now/releases/latest) [![Latest Release Download](https://img.shields.io/github/downloads/funnyzak/tts-now/latest/total.svg)](https://github.com/funnyzak/tts-now/releases/latest) [![Total Download](https://img.shields.io/github/downloads/funnyzak/tts-now/total.svg)](https://github.com/funnyzak/tts-now/releases)

基于大厂语音合成 API 的文字转语音助手。支持单文本快速合成和批量合成。

目前支持阿里云、讯飞，其他平台陆续加入。

好用请 _Star_ 🌞。

## 发布

目前编译版本包含 Windows32/64、Mac、Linux 版，[点此下载](https://github.com/funnyzak/tts-now/releases)。

## 平台

### 阿里云

阿里云创建语音合成 AppKey，以及阿里云账号 API Key。 [直达](https://ai.aliyun.com/nls/tts)。

目前助手已内置阿里云 99 种场景合成。

### 讯飞

到[讯飞云](https://www.xfyun.cn/services/online_tts)注册即可。

目前助手已经内置讯飞 100 多种场景语音合成。

> 需要注意的是，使用特定语音，需要在讯飞云控制台添加场景支持。

## 演示

![演示](https://raw.githubusercontent.com/funnyzak/tts-now/master/public/_docs/assets/img/demo.gif)

## 依赖

助手基于 Electron 构建开发。

> 开发构建使用 Node 版本为 **^14.17.5**，为避免冲突，建议使用此版本。可以使用 **_nvm_** 管理 Node 版本。

主要依赖库：

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

## 目录

- `app.config.js`: app 基础配置
- `electron.builder.js`: 打包配置
- `public`：静态资源文件夹
- `config`：webpack pack、node modules
- `src/background.ts`：Electron Background Process

## 命令

### 安装

`yarn install` or `npm install`

### 脚本

- 开发服务启动 - `npm run serve`
- Lint 格式化 - `npm run lint`
- 源构建输出 - `npm run dist`
- 根据当前系统构建 - `npm run build`
- 基于 dist 输出，根据当前系统构建 - `npm run build:now`
- 构建 Windows 二进制 - `npm run build:windows`
- 构建 Mac 二进制 - `npm run build:mac`
- 构建 Linux 二进制 - `npm run build:linux`

### 输出

- bundle 构建输出 - `./build/bundle`
- 二进制构建输出 - `./build/binary`

## 赞赏

![赞赏](https://raw.githubusercontent.com/funnyzak/tts-now/master/public/_docs/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
