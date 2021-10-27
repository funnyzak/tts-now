export declare interface AppSetting {
  voiceSetIndex: number;
  samplingRate: number;
  outputFormat: string;
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
