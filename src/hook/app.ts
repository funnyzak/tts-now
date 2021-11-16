import { useContext } from 'react';
import { AppContext } from '@/config';
import voiceData from '@/config/voice';
import { TtsEngine } from '@/type/enums';

const SettingContext = () => useContext(AppContext);

const getVoiceTypeList = (_appSetting: APP.AppSetting) => {
  const { ttsSetting } = _appSetting;
  return voiceData[
    ttsSetting?.engine
      ? ttsSetting?.engine.toString()
      : TtsEngine.ALIYUN.toString()
  ];
};

const currentSpeaker = (_appSetting: APP.AppSetting) => {
  const { speakerId } = _appSetting.ttsSetting;

  const voiceTypeList = getVoiceTypeList(_appSetting);

  if (speakerId && speakerId.length === 0) {
    return voiceTypeList[0];
  }
  const _findSpeakers = voiceTypeList.filter((v) => v.speakerId === speakerId);
  return _findSpeakers.length > 0 ? _findSpeakers[0] : voiceTypeList[0];
};

export { getVoiceTypeList, currentSpeaker };

export default SettingContext;
