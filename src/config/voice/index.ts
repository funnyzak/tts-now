import aliyunData from './voiceType'
import xfData from './xf'
import { TtsEngine } from '@/type/enums'

const xf = xfData.map((v) => ({
  speakerId: `${TtsEngine.XUNFEI.toString()}_${v.code}`,
  code: v.code,
  speaker: v.name,
  img: `https://www.xfyun.cn/static/img/online-tts/speaker-photo/small/${
    v.age.indexOf('男童') >= 0
      ? 'xiaoyu'
      : v.age.indexOf('女童') >= 0
        ? 'nannan'
        : v.age.indexOf('男') >= 0
          ? 'hongshu'
          : 'yefang'
  }.png`,
  speechType: v.age,
  scene: v.scene,
  language: v.languages,
  sampleRate: [8000, 16000],
  speechFrom: '官方',
  text: v.text,
  origin: v
}))

const aliyun = aliyunData.map((v) => ({
  ...v,
  speakerId: `${TtsEngine.ALIYUN.toString()}_${v.speakerId}`,
  code: v.speakerId,
  origin: v
}))

export default {
  xf,
  aliyun
}
