import AliTTS from '@/utils/aliyun/alitts';
import { message } from 'antd';
import { App } from 'electron';

/**
 *创建阿里云音频合成class
 * @param aliSetting
 * @returns
 */
export const createAliTTS = (aliSetting: APP.AliSetting): any => {
  return checkAliSetting(aliSetting)
    ? new AliTTS(aliSetting.appKey || '', {
        accessKeyId: aliSetting.accessKeyId || '',
        accessKeySecret: aliSetting.accessKeySecret || '',
        endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
        apiVersion: '2019-02-28'
      })
    : null;
};

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
    isNullOrEmpty(aliSetting) ||
    isNullOrEmpty(aliSetting?.appKey) ||
    isNullOrEmpty(aliSetting?.accessKeyId) ||
    isNullOrEmpty(aliSetting?.accessKeySecret)
  ) {
    if (warn) message.error('请先配置密钥');
    return false;
  }
  return true;
};

export const checkAliSettingNetwork = async (
  aliSetting: APP.AliSetting,
  warn?: boolean
) => {
  if (!checkAliSetting(aliSetting, warn)) return false;
  if (!(await createAliTTS(aliSetting).checkConfig())) {
    message.error('密钥、AppKey貌似不可用哦。');
    return false;
  }
  return true;
};

export const ttsUseEffectDeps = (ttsSetting: APP.TTSSetting) => {
  return [
    ttsSetting.voiceIndex,
    ttsSetting.pitchRate,
    ttsSetting.simpleRate,
    ttsSetting.speedRate
  ];
};

export const aliUseEffectDeps = (aliSetting: APP.AliSetting) => {
  return [
    aliSetting.accessKeyId,
    aliSetting.appKey,
    aliSetting.accessKeySecret
  ];
};

export const settingUseEffectDeps = (appSetting: APP.AppSetting) => {
  return [
    appSetting.ttsSetting.voiceIndex,
    appSetting.ttsSetting.pitchRate,
    appSetting.ttsSetting.simpleRate,
    appSetting.ttsSetting.speedRate,
    appSetting.aliSetting.accessKeyId,
    appSetting.aliSetting.appKey,
    appSetting.aliSetting.accessKeySecret
  ];
};
