import React from 'react';

export { default as voiceTypeList } from './voiceType';

// App 名称
export const appName: string = '语音合成助手';

// ui配置
export const uiConfig = {
  // 导出格式
  outputFormatList: [
    { label: 'mp3', value: 'mp3' },
    { label: 'wav', value: 'wav' },
    { label: 'pcm', value: 'pcm' }
  ],
  // 采样率
  samplingRateList: [
    { label: '8k', value: '8' },
    { label: '16k', value: '16' }
  ]
};

// 默认APP配置
export const defaultAppSetting: APP.AppSetting = {
  ttsSetting: {
    sceneIndex: 0,
    samplingRate: ['8'],
    outputFormat: ['mp3'],
    ttsTone: 50,
    ttsSpeed: 50,
    ttsVolumn: 50
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
export const appSetting: APP.AppSetting = cacheAppSetting
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

// 读取当前配置
export default appName;
