/**
 * 文件合成状态
 */
export enum TtsFileStatus {
  READY = '就绪',
  PROCESS = '处理',
  FAIL = '错误',
  SUCCESS = '成功'
}

/**
 * 语音识别引擎
 */
export enum TtsEngine {
  ALIYUN = 'aliyun',
  XUNFEI = 'xf'
}

export default {}
