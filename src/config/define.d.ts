export declare interface AppSetting {
  // 场景选择
  voiceSetIndex: number;

  // 音量
  ttsVolumn: number;

  // 语速
  ttsSpeed: number;

  // 音调
  ttsTone: number;

  // 比率
  samplingRate: Array<string>;

  // 输出格式
  outputFormat: Array<string>;

  // 单个转换文本内容
  singleTxt?: string;

  // 默认转换选项卡
  actionMode: string;

  // 阿里云配置
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
