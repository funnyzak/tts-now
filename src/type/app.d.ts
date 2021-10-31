import { TtsFileStatus } from './enums';

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};
declare global {
  namespace APP {
    export function SetAppSetting(_settings: {
      [T in keyof AppSetting]?: AppSetting[T];
    }): void;

    export interface AppSetting {
      ttsSetting: TTSSetting;

      customSetting: CustomSetting;

      aliSetting?: AliSetting;
    }

    export interface CustomSetting {
      // 单个转换文本内容
      singleTxt?: string;

      // 默认转换选项卡
      actionMode: string;
    }

    /**
     * TTS 配置
     */
    export interface TTSSetting {
      // 场景索引
      sceneIndex: number;

      // 音量
      ttsVolumn: number;

      // 语速
      ttsSpeed: number;

      // 音调
      ttsTone: number;

      // 比率
      samplingRate: number;

      // 输出格式
      outputFormat: string;
    }

    /**
     * 阿里云配置
     */
    export interface AliSetting {
      appKey?: string;
      accessKeyId?: string;
      accessKeySecret?: string;
    }

    /**
     * 要合成的文件
     */
    export interface TtsFileInfo {
      key?: number;
      /**
       * 转换所使用的配置
       */
      ttsSetting?: TTSSetting;
      /**
       * 文件路径
       */
      filePath: string;
      /**
       * 文件名
       */
      fileName: string;
      /**
       * 文本内容
       */
      textContent: string;
      /**
       *  状态
       */
      status: TtsFileStatus;
      /**
       * 字符数
       */
      wordCount: number;
      /**
       * 转换错误原因
       */
      error?: string;
      /**
       * 转换用时（秒）
       */
      elapsed?: number;
      /**
       * 转换输出音频地址
       */
      audioUrls?: Array<string>;
      /**
       * 保存地址
       */
      audioPaths?: Array<string>;
    }
  }
}
