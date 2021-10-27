import { AppSetting } from '@/config/define';
// App 名称
export const appName: string = '语音合成助手';

// 默认APP配置
const appSetting: AppSetting = {
  voiceSetIndex: 0,
  samplingRate: 8,
  outputFormat: 'mp3',
  appKey: '',
  accessKeyId: '',
  accessKeySecret: ''
};

export default {
  appName,
  appSetting
};
