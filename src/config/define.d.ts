export declare interface AppSetting {
  voiceSetIndex: number;
  // 音量
  ttsVolumn: number;
  // 语速
  ttsSpeed: number;
  // 音调
  ttsTone: number;
  samplingRate: Array<string>;
  outputFormat: Array<string>;
  // 单个转换文本
  singleTxt?: string;
  appKey?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
}

export declare function SetAppSetting(_settings: {
  [T in keyof AppSetting]?: AppSetting[T];
}): void;

declare global {
  interface AppConfig {
    setting: AppSetting;
  }
}
