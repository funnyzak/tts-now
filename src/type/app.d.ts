// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};
declare global {
  namespace APP {
    export function SetAppSetting(_settings: {
      [T in keyof AppSetting]?: AppSetting[T];
    }): void;

    export interface AppSetting {
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

      aliSetting?: IAliSetting;
    }

    /**
     * 阿里云配置
     */
    export interface IAliSetting {
      appKey?: string;
      accessKeyId?: string;
      accessKeySecret?: string;
    }

    /**
     * 文件合成状态
     */
    export enum FileConvertStatus {
      READY = '就绪',
      PROCESS = '处理',
      FAIL = '错误',
      SUCCESS = '成功'
    }

    /**
     * 要合成的文件
     */
    export interface FileInfoProp {
      key: number;
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
      status: FileConvertStatus;
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
