import { useContext } from 'react';
import { AppContext } from '@/config';
import voiceData from '@/config/voice';
import { TtsEngine } from '@/type/enums';

const SettingContext = () => useContext(AppContext);

const getVoiceTypeList = (_engine?: TtsEngine) => {
  const ttsSetting = !_engine ? SettingContext().appSetting.ttsSetting : null;
  return voiceData[
    _engine
      ? _engine.toString()
      : ttsSetting?.engine
        ? ttsSetting?.engine.toString()
        : TtsEngine.ALIYUN.toString()
  ];
};

const currentSpeaker = (_speakerId?: string, _engine?: TtsEngine) => {
  const speakerId = _speakerId || SettingContext().appSetting.ttsSetting.speakerId;

  const voiceTypeList = getVoiceTypeList(_engine);

  if (speakerId && speakerId.length === 0) {
    return voiceTypeList[0];
  }
  const _findSpeakers = voiceTypeList.filter((v) => v.speakerId === speakerId);
  return _findSpeakers.length > 0 ? _findSpeakers[0] : voiceTypeList[0];
};

export { getVoiceTypeList, currentSpeaker };

export default SettingContext;
