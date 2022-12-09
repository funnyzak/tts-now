import { message } from 'antd'
import fs from 'fs'
import { AliyunTTS } from 'aliyun-nls'
import { XFYunTTS } from 'xfyun-nls'
import { ipcRenderer } from 'electron'
import { TtsFileStatus, TtsEngine } from '@/type/enums'
import voiceData from '@/config/voice'
import { EventEmitter, cacheStaticServerPort } from '@/config'

const StaticHttpServer = require('@funnyzak/http-server')

const { DownloaderHelper } = require('node-downloader-helper')

const path = require('path')

let fileCachePath: string

const ENV = process.env.NODE_ENV

export const logger = (...args): void => {
  if (process.env.NODE_ENV === 'development') {
    if (args.length > 1 && args[0] === 'error') {
      console.error('PError:', ...args.slice(1))
    } else {
      console.log('PConsole:', ...args)
    }
  }
}

export const isNullOrEmpty = (val: any): boolean => {
  if (!val || val === null) {
    return true
  }
  if (typeof val === 'string' && val.length === 0) {
    return true
  }
  return false
}

export const delDirPath = (_path) => {
  if (fs.existsSync(_path)) {
    try {
      const files = fs.readdirSync(_path)
      files.forEach((file) => {
        const curPath = `${_path}/${file}`
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          delDirPath(curPath)
        } else {
          // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(_path)
    } catch (error) {
      logger('error', 'delDirPath', error)
    }
  }
}

export const getAppPath = (_pathName, callback) => {
  ipcRenderer.once(EventEmitter.GET_PATH, (_event, arg) => {
    callback(arg)
  })

  ipcRenderer.send(EventEmitter.GET_PATH, {
    pathName: _pathName
  })
}

let staticServer
/**
 * 应用检查、清理、初始化
 */
export const appReset = () => {
  getAppPath('cache', (path_info) => {
    fileCachePath = path_info.path

    /**
     * 声明静态服务器
     */
    staticServer = new StaticHttpServer({
      port: cacheStaticServerPort,
      root: fileCachePath
    })

    // 启动缓存静态服务器
    staticServer.serve()
  })
}

export const staticUrl = (filePath: string) => staticServer.parseVirtualPath(filePath, true)

export const checkDirExist = (
  _path?: string,
  _tipIfNoExists?: string
): boolean => {
  if (!fs.existsSync(_path || '')) {
    if (_tipIfNoExists) {
      message.warning(_tipIfNoExists)
    }
    return false
  }
  return true
}

export const selectDirection = (
  actionName: string,
  callback: (path: string) => void
) => {
  ipcRenderer.once(EventEmitter.SELECTED_FILES, (_event, arg) => {
    if (arg.action === actionName && !arg.data.canceled) {
      callback(arg.data.filePaths[0])
    }
  })

  ipcRenderer.send(EventEmitter.SELECT_FILES, {
    action: actionName,
    config: {
      title: '选择路径',
      properties: ['openDirectory', 'noResolveAliases', 'createDirectory']
    }
  })
}

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
  const dl = new DownloaderHelper(url, savePath || __dirname, options)
  dl.on('end', () => resolve(true))
  dl.start()
})

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
    if (warn) message.error('请先配置阿里云密钥')
    return false
  }
  return true
}

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
    if (warn) message.error('请先配置讯飞密钥')
    return false
  }
  return true
}

/**
 *创建阿里云音频合成class
 * @param aliSetting
 * @returns
 */
export const createAliyunTTS = (aliSetting: APP.AliSetting): any => (checkAliSetting(aliSetting)
  ? new AliyunTTS(
    {
      accessKeyId: aliSetting.accessKeyId || '',
      accessKeySecret: aliSetting.accessKeySecret || '',
      endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
      nlsUrl:
            'https://nls-gateway.cn-shanghai.aliyuncs.com/rest/v1/tts/async',
      apiVersion: '2019-02-28'
    },
    aliSetting.appKey || ''
  )
  : null)

export const createXunFeiTTS = (xfSetting: APP.XfSetting): any => (checkXfSetting(xfSetting)
  ? new XFYunTTS(
    {
      appId: xfSetting.appId || '',
      apiSecret: xfSetting.apiSecret || '',
      apiKey: xfSetting.apiKey || '',
      host: 'tts-api.xfyun.cn',
      uri: '/v2/tts',
      hostUrl: 'wss://tts-api.xfyun.cn/v2/tts'
    },
    fileCachePath
  )
  : null)

export const checkAliSettingNetwork = async (
  aliSetting: APP.AliSetting,
  warn?: boolean
) => {
  if (!checkAliSetting(aliSetting, warn)) return false

  if (!(await createAliyunTTS(aliSetting).checkConfig())) {
    message.error('密钥、AppKey貌似不可用哦。')
    return false
  }
  return true
}

export const checkXfSettingNetwork = async (
  xfSetting: APP.XfSetting,
  warn?: boolean
) => {
  if (!checkXfSetting(xfSetting, warn)) return false

  if (!(await createXunFeiTTS(xfSetting).checkConfig())) {
    message.error('讯飞配置貌似不可用哦。')
    return false
  }
  return true
}

export const ttsUseEffectDeps = (ttsSetting: APP.TTSSetting) => [
  ttsSetting.speakerId,
  ttsSetting.pitchRate,
  ttsSetting.simpleRate,
  ttsSetting.speedRate,
  ttsSetting.volumn,
  ttsSetting.format
]

export const aliUseEffectDeps = (aliSetting: APP.AliSetting) => [
  aliSetting.accessKeyId,
  aliSetting.appKey,
  aliSetting.accessKeySecret
]

export const settingUseEffectDeps = (appSetting: APP.AppSetting) => [
  appSetting.ttsSetting.speakerId,
  appSetting.ttsSetting.pitchRate,
  appSetting.ttsSetting.simpleRate,
  appSetting.ttsSetting.speedRate,
  appSetting.aliSetting.accessKeyId,
  appSetting.aliSetting.appKey,
  appSetting.aliSetting.accessKeySecret
]

export const getVoiceTypeList = (_appSetting: APP.AppSetting) => {
  const { ttsSetting } = _appSetting
  return voiceData[
    ttsSetting?.engine
      ? ttsSetting?.engine.toString()
      : TtsEngine.ALIYUN.toString()
  ]
}

export const currentSpeaker = (_appSetting: APP.AppSetting) => {
  const { speakerId } = _appSetting.ttsSetting

  const voiceTypeList = getVoiceTypeList(_appSetting)

  if (speakerId && speakerId.length === 0) {
    return voiceTypeList[0]
  }
  const _findSpeakers = voiceTypeList.filter((v) => v.speakerId === speakerId)
  return _findSpeakers.length > 0 ? _findSpeakers[0] : voiceTypeList[0]
}

/**
 * 运行转换任务时检查
 * @param appSetting
 * @returns
 */
export const ttsRunCheck = (appSetting: APP.AppSetting) => {
  let checkRlt = true
  if (appSetting.ttsSetting.engine === TtsEngine.ALIYUN) {
    checkRlt = checkAliSetting(appSetting.aliSetting, true)
  } else if (appSetting.ttsSetting.engine === TtsEngine.XUNFEI) {
    checkRlt = checkXfSetting(appSetting.xfSetting, true)
  }
  return checkRlt
}

export const exportAudioFile = (_info: APP.TtsFileInfo) => {
  logger('export audio file =>', _info)
  if (_info.audioUrl) {
    if (_info.audioUrl.startsWith('http')) {
      downloadFile(_info.audioUrl, _info.savePath, {
        fileName: _info.saveName
      })
    } else {
      const _path = _info.audioUrl.replace('file://', '')
      if (fs.existsSync(_path)) {
        fs.copyFileSync(_path, path.join(_info.savePath, _info.saveName))
      }
    }
  }
}

/**
 * 开始批量转换任务
 * @param appSetting 应用配置
 * @param ttsFiles 转换的文件列表
 * @param callback 转换的文件
 * @param download 是否需要下载
 */
export const ttsTasksRun = async (
  appSetting: APP.AppSetting,
  ttsFiles: Array<APP.TtsFileInfo>,
  callback: (
    current: APP.TtsFileInfo,
    ttsFiles: Array<APP.TtsFileInfo>
  ) => void,
  download: boolean = false
) => {
  if (!ttsRunCheck(appSetting)) return

  const aliTtsInstance = createAliyunTTS(appSetting.aliSetting)
  const xfTtsInstance = createXunFeiTTS(appSetting.xfSetting)

  const setStart = (_info: APP.TtsFileInfo): APP.TtsFileInfo => {
    _info.ttsSetting = appSetting.ttsSetting
    _info.status = TtsFileStatus.PROCESS
    _info.wordCount = _info.textContent.length
    _info.ttsStart = new Date().getTime()
    _info.savePath = appSetting.customSetting.savePath
    _info.saveName = `${appSetting.ttsSetting.engine.toString()}_${
      currentSpeaker(appSetting).speaker
    }_${
      _info.fileName?.split('.')[0]
    }_${new Date().getTime()}.${_info.ttsSetting.format}`
    return _info
  }

  const setError = (_info: APP.TtsFileInfo, _error): APP.TtsFileInfo => {
    _info.taskId = ''
    _info.status = TtsFileStatus.FAIL
    _info.error = _error
    logger(_info, _error)
    return _info
  }

  const setSuccess = (_info: APP.TtsFileInfo): APP.TtsFileInfo => {
    _info.status = TtsFileStatus.SUCCESS
    _info.ttsEnd = new Date().getTime()
    _info.elapsed = _info.ttsStart ? _info.ttsEnd - _info.ttsStart : undefined

    if (download) {
      exportAudioFile(_info)
    }
    return _info
  }

  // 开始所有转换任务
  for (let finfo of ttsFiles) {
    finfo = setStart(finfo)
    callback(finfo, ttsFiles)

    try {
      if (appSetting.ttsSetting.engine === TtsEngine.ALIYUN) {
        finfo.taskId = await aliTtsInstance.task(finfo.textContent, {
          format: appSetting.ttsSetting.format,
          sample_rate: appSetting.ttsSetting.simpleRate,
          voice: currentSpeaker(appSetting).code,
          volume: appSetting.ttsSetting.volumn,
          speech_rate: appSetting.ttsSetting.speedRate,
          pitchRate: appSetting.ttsSetting.pitchRate
        })
        finfo.status = TtsFileStatus.PROCESS
      } else if (appSetting.ttsSetting.engine === TtsEngine.XUNFEI) {
        finfo.taskId = (
          await xfTtsInstance.send(finfo.textContent, {
            aue: appSetting.ttsSetting.format === 'mp3' ? 'lame' : 'raw',
            auf: `audio/L16;rate=${appSetting.ttsSetting.simpleRate}`,
            vcn: currentSpeaker(appSetting).code,
            volume: appSetting.ttsSetting.volumn,
            speed: appSetting.ttsSetting.speedRate,
            pitch: appSetting.ttsSetting.pitchRate
          })
        ).filePath
        finfo.audioUrl = staticUrl(finfo.taskId ?? '')
        setSuccess(finfo)
      }
    } catch (error) {
      setError(finfo, error)
    }
    callback(finfo, ttsFiles)
  }

  const statusPull = async () => {
    for (const finfo of ttsFiles) {
      if (finfo.status !== TtsFileStatus.PROCESS) {
        continue
      }
      try {
        if (appSetting.ttsSetting.engine === TtsEngine.ALIYUN) {
          const aliTtsComplete: AliyunTTS.TTSComplete = await aliTtsInstance.status(finfo.taskId)

          if (!isNullOrEmpty(aliTtsComplete.audio_address)) {
            finfo.audioUrl = aliTtsComplete.audio_address
            setSuccess(finfo)
          }
        }

        callback(finfo, ttsFiles)
      } catch (error) {
        setError(finfo, error)
      }
    }

    if (ttsFiles.filter((v) => v.status === TtsFileStatus.PROCESS).length > 0) {
      setTimeout(statusPull, 100)
    }
  }

  if ([TtsEngine.ALIYUN].includes(appSetting.ttsSetting.engine)) statusPull()
}
