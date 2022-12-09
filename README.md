# 云语音合成助手

[![Build Status][build-status-image]][build-status]
[![tag][tag-image]][rle-url]
[![Latest Release Download][down-latest-image]][rle-url]
[![Total Download][down-total-image]][rle-all-url]
[![Release Date][rle-image]][rle-url]
[![license][license-image]][repository-url]

<!-- [![action][ci-image]][ci-url] -->

[down-latest-image]: https://img.shields.io/github/downloads/funnyzak/tts-now/latest/total.svg
[down-total-image]: https://img.shields.io/github/downloads/funnyzak/tts-now/total.svg
[rle-image]: https://img.shields.io/github/release-date/funnyzak/tts-now.svg
[rle-url]: https://github.com/funnyzak/tts-now/releases/latest
[rle-all-url]: https://github.com/funnyzak/tts-now/releases
[ci-image]: https://img.shields.io/github/workflow/status/funnyzak/tts-now/release
[ci-url]: https://github.com/funnyzak/tts-now/actions
[license-image]: https://img.shields.io/github/license/funnyzak/tts-now.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/tts-now
[build-status-image]: https://github.com/funnyzak/tts-now/actions/workflows/ci.yml/badge.svg
[build-status]: https://github.com/funnyzak/tts-now/actions
[tag-image]: https://img.shields.io/github/tag/funnyzak/tts-now.svg

跨平台基于云平台的语音合成 API 的文字转语音助手。支持单文本快速合成和批量合成。支持 windows、macOS、Linux。

目前支持阿里云、讯飞，其他平台陆续加入。

`如果觉得不错，来个 star 支持下作者吧！你的 Star 是我更新代码的动力！：）`

想任何想吐槽或者建议的都可以直接飞个 [issue](https://github.com/funnyzak/tts-now/issues).

## TODO

- [ ] 接入百度云
- [ ] 接入腾讯云
- [x] 增加升级更新提示
- [x] 配置框增加清除配置按钮

## 目录

- [云语音合成助手](#云语音合成助手)
  - [TODO](#todo)
  - [目录](#目录)
  - [发布](#发布)
  - [平台](#平台)
    - [阿里云](#阿里云)
    - [讯飞](#讯飞)
  - [演示](#演示)
  - [依赖](#依赖)
  - [目录](#目录-1)
  - [开发](#开发)
  - [Contribution](#contribution)
  - [License](#license)

## 发布

目前编译版本包含 Windows32/64、Mac、Linux 版，[点此下载](https://github.com/funnyzak/tts-now/releases)。

## 平台

### 阿里云

阿里云创建语音合成 AppKey，以及阿里云账号 API Key。 [直达](https://ai.aliyun.com/nls/tts)。

目前助手已内置阿里云 99 种场景合成。

### 讯飞

到 [讯飞云](https://www.xfyun.cn/services/online_tts) 注册即可。

目前助手已经内置讯飞 100 多种场景语音合成。

> 需要注意的是，使用特定语音，需要在讯飞云控制台添加场景支持。

## 演示

![演示](https://raw.githubusercontent.com/funnyzak/tts-now/master/public/_docs/assets/img/demo.png)

## 依赖

主要依赖库：

- electron-builder
- eslint
- babel
- css-loader
- less
- sass
- typescript
- webpack
- prettier

## 目录

    ├── app.config.js                      // 基础配置
    ├── babel.config.js                    // babel 配置
    ├── build                              // 打包输出文件夹
    │   ├── binary                         // 二进制打包输出
    │   └── bundle                         // renderer main打包源输出
    ├── config                             // 打包配置
    │   ├── dev.js                         // 开发监听启动
    │   ├── dist.js                        // 发布打包源
    │   ├── webpack.main.js                // background 编译
    │   └── webpack.renderer.js            // renderer 编译
    ├── electron.builder.js                // electron.builder 二进制打包配置
    ├── global.d.ts                        // typescript 全局声明
    ├── lint-staged.config.js              // git commit 钩子
    ├── public                             // 静态文件
    ├── src                                // 页面源
    │   ├── App.less                       // 入口样式
    │   ├── assets                         // 资源文件
    │   ├── background.ts                  // electron background
    │   ├── config                         // 应用配置
    │   ├── hook                           // hook
    │   ├── index.tsx                      // entry file
    │   ├── layout                         // 布局
    │   ├── type                           // 声明文件
    │   └── utils                          // 工具
    └── tsconfig.json                      // typescript 配置
    └── tslint.json                        // tslint 配置

## 开发

安装依赖先

```bash
$ yarn
```

然后可执行如下脚本命令：

```bash
# 开发服务启动
$ yarn serve

# Lint 格式化
$ yarn lint

# 源构建输出
$ yarn dist

# 根据当前系统构建
$ yarn build

# 基于 dist 输出，根据当前系统构建
$ yarn build:now

# 构建 Windows 二进制
$ yarn build:windows

# 构建 Mac 二进制
$ yarn build:mac

# 构建 Linux 二进制
$ yarn build:linux

# 构建三平台
$ yarn build:all

```

## Contribution

如果你有任何的想法或者意见，欢迎提 Issue 或者 PR。

<a href="https://github.com/funnyzak/tts-now/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=funnyzak/tts-now" />
</a>

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
