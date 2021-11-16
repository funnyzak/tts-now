import { message } from 'antd';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import AliTTS from '@/utils/aliyun/AliyunTTS';
import XfWsTTS from '@/utils/xunfei/XunfeiWsTTS';

import { EventEmitter, fileCachePath } from '@/config';

const { DownloaderHelper } = require('node-downloader-helper');

const ENV = process.env.NODE_ENV;

export const delDirPath = (path) => {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        delDirPath(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

export const appReset = () => {
  delDirPath(fileCachePath);
};

export const checkDirExist = (
  _path?: string,
  _tipIfNoExists?: string
): boolean => {
  if (!fs.existsSync(_path || '')) {
    if (_tipIfNoExists) {
      message.warn(_tipIfNoExists);
    }
    return false;
  }
  return true;
};

export const selectDirection = (
  actionName: string,
  callback: (path: string) => void
) => {
  ipcRenderer.once(EventEmitter.SELECTED_FILES, (_event, arg) => {
    if (arg.action === actionName && !arg.data.canceled) {
      callback(arg.data.filePaths[0]);
    }
  });

  ipcRenderer.send(EventEmitter.SELECT_FILES, {
    action: actionName,
    config: {
      title: '选择路径',
      properties: ['openDirectory', 'noResolveAliases', 'createDirectory']
    }
  });
};

/**
 * 通过URL下载文件
 * @param url
 * @param savePath
 * @param {
    method: 'GET', // Request Method Verb
    headers: {},  // Custom HTTP Header ex: Authorization, User-Agent
    fileName: string|cb(fileName, filePath, contentType)|{name, ext}, // Custom filename when saved
    retry: false, // { maxRetries: number, delay: number in ms } or false to disable (default)
    forceResume: false, // If the server does not return the "accept-ranges" header, can be force if it does support it
    removeOnStop: true, // remove the file when is stopped (default:true)
    removeOnFail: true, // remove the file when fail (default:true)
    progressThrottle: 1000, // interval time of the 'progress.throttled' event will be emitted
    override: boolean|{skip, skipSmaller}, // Behavior when local file already exists
    httpRequestOptions: {}, // Override the http request options
    httpsRequestOptions: {}, // Override the https request options, ex: to add SSL Certs
}
 * @returns
 */
export const downloadFile = (
  url: string,
  savePath?: string,
  options?: any
): Promise<boolean> => new Promise<boolean>((resolve) => {
  const dl = new DownloaderHelper(url, savePath || __dirname, options);
  dl.on('end', () => resolve(true));
  dl.start();
});

/**
 *创建阿里云音频合成class
 * @param aliSetting
 * @returns
 */
export const createAliyunTTS = (aliSetting: APP.AliSetting): any => (checkAliSetting(aliSetting)
  ? new AliTTS(
    aliSetting.appKey || '',
    {
      accessKeyId: aliSetting.accessKeyId || '',
      accessKeySecret: aliSetting.accessKeySecret || '',
      endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
      apiVersion: '2019-02-28'
    },
    ENV === 'development'
  )
  : null);

export const createXunFeiTTS = (xfSetting: APP.XfSetting): any => (checkXfSetting(xfSetting)
  ? new XfWsTTS(
    {
      appId: xfSetting.appId || '',
      apiSecret: xfSetting.apiSecret || '',
      apiKey: xfSetting.apiKey || '',
      host: 'tts-api.xfyun.cn',
      uri: '/v2/tts'
    },
    fileCachePath,
    ENV === 'development'
  )
  : null);

export const isNullOrEmpty = (val: any): boolean => {
  if (!val || val === null) {
    return true;
  }
  if (typeof val === 'string' && val.length === 0) {
    return true;
  }
  return false;
};

export const checkAliSetting = (
  aliSetting?: APP.AliSetting,
  warn?: boolean
): boolean => {
  if (
    isNullOrEmpty(aliSetting)
    || isNullOrEmpty(aliSetting?.appKey)
    || isNullOrEmpty(aliSetting?.accessKeyId)
    || isNullOrEmpty(aliSetting?.accessKeySecret)
  ) {
    if (warn) message.error('请先配置阿里云密钥');
    return false;
  }
  return true;
};

export const checkXfSetting = (
  xfSetting?: APP.XfSetting,
  warn?: boolean
): boolean => {
  if (
    isNullOrEmpty(xfSetting)
    || isNullOrEmpty(xfSetting?.apiKey)
    || isNullOrEmpty(xfSetting?.apiSecret)
    || isNullOrEmpty(xfSetting?.appId)
  ) {
    if (warn) message.error('请先配置讯飞密钥');
    return false;
  }
  return true;
};

export const checkAliSettingNetwork = async (
  aliSetting: APP.AliSetting,
  warn?: boolean
) => {
  if (!checkAliSetting(aliSetting, warn)) return false;

  if (!(await createAliyunTTS(aliSetting).checkConfig())) {
    message.error('密钥、AppKey貌似不可用哦。');
    return false;
  }
  return true;
};

export const checkXfSettingNetwork = async (
  xfSetting: APP.XfSetting,
  warn?: boolean
) => {
  if (!checkXfSetting(xfSetting, warn)) return false;

  if (!(await createXunFeiTTS(xfSetting).checkConfig())) {
    message.error('讯飞配置貌似不可用哦。');
    return false;
  }
  return true;
};

export const ttsUseEffectDeps = (ttsSetting: APP.TTSSetting) => [
  ttsSetting.speakerId,
  ttsSetting.pitchRate,
  ttsSetting.simpleRate,
  ttsSetting.speedRate,
  ttsSetting.volumn,
  ttsSetting.format
];

export const aliUseEffectDeps = (aliSetting: APP.AliSetting) => [
  aliSetting.accessKeyId,
  aliSetting.appKey,
  aliSetting.accessKeySecret
];

export const settingUseEffectDeps = (appSetting: APP.AppSetting) => [
  appSetting.ttsSetting.speakerId,
  appSetting.ttsSetting.pitchRate,
  appSetting.ttsSetting.simpleRate,
  appSetting.ttsSetting.speedRate,
  appSetting.aliSetting.accessKeyId,
  appSetting.aliSetting.appKey,
  appSetting.aliSetting.accessKeySecret
];

export const logger = (...args): void => {
  if (process.env.NODE_ENV === 'development') {
    if (args.length > 1 && args[0] === 'error') {
      console.error('PError:', ...args.slice(1));
    } else {
      console.log('PConsole:', ...args);
    }
  }
};
