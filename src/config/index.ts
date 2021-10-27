import React from 'react';
import { AppSetting } from './define';

export { default as voiceTypeList } from './voiceType';

// App 名称
export const appName: string = '语音合成助手';

// 默认APP配置
export const defaultAppSetting: AppSetting = {
  voiceSetIndex: 0,
  samplingRate: 8,
  outputFormat: 'mp3',
  appKey: '',
  accessKeyId: '',
  accessKeySecret: ''
};

// App配置缓存Key
export const appSettingCacheKey = 'AppSetting';

// 读取缓存配置
export const cacheAppSetting = localStorage.getItem(appSettingCacheKey);

// 读取当前配置
export const appSetting: AppSetting = cacheAppSetting
  ? JSON.parse(cacheAppSetting)
  : defaultAppSetting;

// 创建App Context
export const AppContext = React.createContext({
  appSetting,
  setAppSetting: (_settings: AppSetting) => {
    // console.log(appSetting)
  }
});

// 读取当前配置
export default appName;
