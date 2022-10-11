import { TtsFileStatus, TtsEngine } from './enums'

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {}
declare global {
  namespace APP {
    export function SetAppSetting(_settings: {
      [T in keyof AppSetting]?: AppSetting[T];
    }): void;

    export interface AppSetting {
      ttsSetting: TTSSetting;

      customSetting: CustomSetting;

      aliSetting: AliSetting;

      xfSetting: XfSetting;
    }

    export interface CustomSetting {
      // 单个转换文本内容
      singleTxt?: string;

      // 默认转换选项卡
      actionMode: string;

      // 保存路径
      savePath?: string;
    }

    /**
     * TTS 配置
     */
    export interface TTSSetting {
      // 使用的引擎
      engine: TtsEngine;

      // 场景索引
      speakerId?: string;

      // 音量0-100
      volumn: number;

      // 语速0-100
      speedRate: number;

      // 语调0-100
      pitchRate: number;

      // 音频采样率，支持16000Hz和8000Hz
      simpleRate: number;

      // 输出格式
      format: string;
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
     * 讯飞配置
     */
    export interface XfSetting {
      appId?: string;
      apiSecret?: string;
      apiKey?: string;
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
       * 原文件路径
       */
      filePath?: string;
      /**
       * 原文件名
       */
      fileName?: string;
      /**
       * 文本内容
       */
      textContent: string;
      /**
       *  状态
       */
      status?: TtsFileStatus;
      /**
       * 字符数
       */
      wordCount?: number;
      /**
       * 转换错误原因
       */
      error?: Error;
      /**
       * 转换用时（秒）
       */
      elapsed?: number;
      /**
       * 转换结束时间
       */
      ttsStart?: number;
      /**
       * 转换开始时间
       */
      ttsEnd?: number;
      /**
       * 转换任务ID
       */
      taskId?: string;
      /**
       * 转换输出音频地址
       */
      audioUrl?: string;
      /**
       * 保存地址
       */
      savePath?: string;

      /**
       * 保存名称
       */
      saveName?: string;
    }
  }
}
