import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import Store from 'electron-store'
import { TtsEngine } from '@/type/enums'
import voiceData from './voice'

const path = require('path')

// App 名称
export const appName = '智能语音合成助手'

/**
 * 缓存静态服务器端口
 */
export const cacheStaticServerPort = 20168

// ui配置
export const uiConfig = {
  // 导出格式
  outputFormatList: (_engine: TtsEngine) => [
    { label: 'mp3', value: 'mp3' },
    { label: 'pcm', value: 'pcm' }
  ].concat(
    _engine === TtsEngine.ALIYUN ? [{ label: 'wav', value: 'wav' }] : []
  )
}

// 默认APP配置
export const defaultAppSetting: APP.AppSetting = {
  ttsSetting: {
    engine: TtsEngine.ALIYUN,
    simpleRate: 16000,
    format: 'mp3',
    pitchRate: 50,
    speedRate: 50,
    volumn: 50
  },
  aliSetting: {
    appKey: '',
    accessKeyId: '',
    accessKeySecret: ''
  },
  xfSetting: {
    apiKey: '',
    apiSecret: '',
    appId: ''
  },
  customSetting: {
    actionMode: 'SINGLE',
    singleTxt: ''
  }
}

// App配置缓存Key
export const appSettingCacheKey = 'AppSetting'

const store = new Store<APP.AppSetting>()

// 读取缓存配置
export const cacheAppSetting: APP.AppSetting = store.get(appSettingCacheKey)

// 读取当前配置
const appSetting: APP.AppSetting = {
  ...defaultAppSetting,
  ...cacheAppSetting
}

const checkConfig = (_appSetting: APP.AppSetting) => {
  if (!_appSetting.ttsSetting.engine) {
    _appSetting.ttsSetting.engine = TtsEngine.ALIYUN
  }

  if (!_appSetting.ttsSetting.speakerId) {
    _appSetting.ttsSetting.speakerId = voiceData[_appSetting.ttsSetting.engine.toString()][0].speakerId
  }

  if (!_appSetting.xfSetting) {
    _appSetting.xfSetting = {
      apiKey: '',
      apiSecret: '',
      appId: ''
    }
  }
}

checkConfig(appSetting)

function resetConfig() {
  const currentAppSetting: APP.AppSetting = store.get(appSettingCacheKey)
  const newSetting = {
    ...currentAppSetting,
    aliSetting: defaultAppSetting.aliSetting,
    xfSetting: defaultAppSetting.xfSetting
  }

  checkConfig(newSetting)

  store.set(appSettingCacheKey, newSetting)
  return newSetting
}

export {
  resetConfig, checkConfig, appSetting, store
}

// 创建App Context
export const AppContext = React.createContext({
  appSetting,
  setAppSetting: (_settings: {
    [T in keyof APP.AppSetting]?: APP.AppSetting[T]
  }) => {
    // console.log(appSetting)
  }
})

// 事件发射器名称
export const EventEmitter = {
  SELECT_FILES: 'select_files',
  SELECTED_FILES: 'selected_files',
  GET_PATH: 'getpath'
}

// 读取当前配置
export default appName

// iconfont icon
const IFIcon = createFromIconfontCN({
  extraCommonProps: { type: 'custom_icon' },
  scriptUrl: `//at.alicdn.com/t/font_2904715_u3pj13pvo9l.js?=${new Date().getTime()}`
})

export { IFIcon }
