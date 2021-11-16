import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { TtsEngine } from '@/type/enums';

// App 名称
export const appName = '智能语音合成助手';

// ui配置
export const uiConfig = {
  // 导出格式
  outputFormatList: [
    { label: 'mp3', value: 'mp3' },
    { label: 'wav', value: 'wav' },
    { label: 'pcm', value: 'pcm' }
  ]
};

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
};

// App配置缓存Key
export const appSettingCacheKey = 'AppSetting';

// 读取缓存配置
export const cacheAppSetting = localStorage.getItem(appSettingCacheKey);

// 读取当前配置
export const appSetting: APP.AppSetting = cacheAppSetting && JSON.parse(cacheAppSetting).customSetting
  ? JSON.parse(cacheAppSetting)
  : defaultAppSetting;

// 创建App Context
export const AppContext = React.createContext({
  appSetting,
  setAppSetting: (_settings: {
    [T in keyof APP.AppSetting]?: APP.AppSetting[T];
  }) => {
    // console.log(appSetting)
  }
});

// 事件发射器名称
export const EventEmitter = {
  SELECT_FILES: 'select_files',
  SELECTED_FILES: 'selected_files'
};

// 读取当前配置
export default appName;

// iconfont icon
const IFIcon = createFromIconfontCN({
  extraCommonProps: { type: 'custom_icon' },
  scriptUrl: `//at.alicdn.com/t/font_2904715_u3pj13pvo9l.js?=${new Date().getTime()}`
});

export { IFIcon };
