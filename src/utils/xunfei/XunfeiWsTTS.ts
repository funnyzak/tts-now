const CryptoJS = require('crypto-js');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

/**
 * 讯飞语音配置
 */
export interface XfWsConfig {
  appId: string;
  apiSecret: string;
  apiKey: string;
  host?: string;
  uri?: string;
  hostUrl?: string;
}

/**
 * Business Option
 * https://www.xfyun.cn/doc/tts/online_tts/API.html#%E6%8E%A5%E5%8F%A3%E8%A6%81%E6%B1%82
 */
export interface XfTtsBusinessOption {
  /**
   * 文本编码格式
   * GB2312
   * GBK
   * BIG5
   * UNICODE(小语种必须使用UNICODE编码，合成的文本需使用utf16小端的编码方式，详见java示例demo)
   * GB18030
   * UTF8（小语种）
   */
  tte: 'UTF8' | 'GB2312' | 'GBK' | 'BIG5' | 'UNICODE' | 'GB18030';
  /**
   * 音频编码，可选值：
   * raw：未压缩的pcm
   * lame：mp3 (当aue=lame时需传参sfl=1)
   * speex-org-wb;7： 标准开源speex（for speex_wideband，即16k）数字代表指定压缩等级（默认等级为8）
   * speex-org-nb;7： 标准开源speex（for speex_narrowband，即8k）数字代表指定压缩等级（默认等级为8）
   * speex;7：压缩格式，压缩等级1~10，默认为7（8k讯飞定制speex）
   * speex-wb;7：压缩格式，压缩等级1~10，默认为7（16k讯飞定制speex）
   */
  aue: string;
  /**
   * 需要配合aue=lame使用，开启流式返回
   * mp3格式音频
   * 取值：1 开启
   */
  sfl?: number;
  /**
   * 音频采样率，可选值：
   * audio/L16;rate=8000：合成8K 的音频
   * audio/L16;rate=16000：合成16K 的音频
   * auf不传值：合成16K 的音频
   */
  auf?: string;
  /**
   *发音人，可选值：请到控制台添加试用或购买发音人，添加后即显示发音人参数值
   */
  vcn: string;
  /**
   * 语速，可选值：[0-100]，默认为50
   */
  speed?: number;
  /**
   * 音量，可选值：[0-100]，默认为50
   */
  volume?: number;
  /**
   * 音高，可选值：[0-100]，默认为50
   */
  pitch?: number;
  /**
   * 合成音频的背景音
   * 0:无背景音（默认值）
   * 1:有背景音
   */
  bgs?: number;
  /**
   * 设置英文发音方式：
   * 0：自动判断处理，如果不确定将按照英文词语拼写处理（缺省）
   * 1：所有英文按字母发音
   * 2：自动判断处理，如果不确定将按照字母朗读
   * 默认按英文单词发音
   */
  reg?: number;
  /**
   * 合成音频数字发音方式
   * 0：自动判断（默认值）
   * 1：完全数值
   * 2：完全字符串
   * 3：字符串优先
   */
  rdn?: string;
}

/**
 * 讯飞语音合成
 */
class XfWsTTS {
  private debug: boolean = false;

  private ws?: WebSocket;

  /**
   *讯飞配置
   *
   * @type {XfWsConfig}
   * @memberof XfWsTTS
   */
  xfConfig: XfWsConfig;

  /**
   * 转换业务选项
   *
   * @private
   * @type {XfTtsBusinessOption}
   * @memberof XfWsTTS
   */
  private businessOption?: XfTtsBusinessOption;

  /**
   *临时文件缓存路径
   *
   * @private
   * @type {string}
   * @memberof XfWsTTS
   */
  private cachePath: string = process.cwd();

  /**
   *默认配置
   *
   * @type {XfTtsBusinessOption}
   * @memberof XfWsTTS
   */
  readonly defXfTtsBusinessOption: XfTtsBusinessOption = {
    aue: 'lame',
    sfl: 1,
    auf: 'audio/L16;rate=16000',
    vcn: 'xiaoyan',
    speed: 50,
    volume: 50,
    pitch: 50,
    bgs: 0,
    tte: 'UTF8',
    rdn: '0'
  };

  constructor(
    xfwsConfig: XfWsConfig,
    cachePath: string,
    debug: boolean = true
  ) {
    this.xfConfig = xfwsConfig;
    this.debug = debug;
    this.cachePath = cachePath;
    this.fixConfig();

    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(this.cachePath);
    }
  }

  static rtcNow() {
    // 获取当前时间 RFC1123格式
    return new Date().toUTCString();
  }

  private getWssUrl() {
    const _rtcNow = XfWsTTS.rtcNow();
    const wssUrl = `${this.xfConfig.hostUrl}?authorization=${this.signature(
      _rtcNow
    )}&date=${_rtcNow}&host=${this.xfConfig.host}`;
    this.log('Wss URL', wssUrl);
    return wssUrl;
  }

  /**
   * 检查配置
   */
  private fixConfig() {
    if (!this.xfConfig.host) {
      this.xfConfig.host = 'tts-api.xfyun.cn';
    }
    if (!this.xfConfig.uri) {
      this.xfConfig.uri = '/v2/tts';
    }
    if (!this.xfConfig.hostUrl) {
      this.xfConfig.hostUrl = `wss://${this.xfConfig.host}${this.xfConfig.uri}`;
    }
  }

  /**
   * 网络检查配置是否正确
   * @returns
   */
  async checkConfig(): Promise<boolean> {
    try {
      await this.send('Hello');
      return true;
    } catch (e) {
      this.log(e);
      return false;
    }
  }

  private receive(): Promise<string> {
    const fileCachePath = path.join(
      this.cachePath,
      `${(Math.random() + 1).toString(36).substring(7)}.${
        this.businessOption?.aue === 'raw'
          ? 'pcm'
          : this.businessOption?.aue === 'lame'
            ? 'mp3'
            : 'audio'
      }`
    );
    this.log('seted auto cache path=>', fileCachePath);

    return new Promise<string>((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('ws is null.'));
        return;
      }

      this.ws.onmessage = (ev: MessageEvent) => {
        this.log('ws received.  data=>', ev.data);

        const res = JSON.parse(ev.data);

        if (res.code !== 0) {
          this.log(`${res.code}: ${res.message}`);
          this.ws?.close();
          reject(res);
          return;
        }

        const { audio } = res.data;
        const audioBuf = Buffer.from(audio, 'base64');

        fs.writeFile(fileCachePath, audioBuf, { flag: 'a' }, (err) => {
          if (err) {
            reject(err);
            return;
          }
          this.log('file append done.');
        });

        if (res.code === 0 && res.data.status === 2) {
          this.ws?.close();
          this.log('file write done.');
          resolve(fileCachePath);
        }
      };
    });
  }

  /**
   * @param text 要合成的文本
   * @param options 转换选项
   */
  send(text: string, options?: XfTtsBusinessOption): Promise<string> {
    this.ws = new WebSocket(this.getWssUrl());

    return new Promise<string>((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('ws is null.'));
        return;
      }

      this.ws.onopen = () => {
        this.log('ws opened.');

        this.businessOption = {
          ...this.defXfTtsBusinessOption,
          ...options
        };

        const frame = {
          common: {
            app_id: this.xfConfig.appId
          },
          business: { ...this.businessOption },
          data: {
            text: Buffer.from(text).toString('base64'),
            status: 2
          }
        };
        this.log('send data:', frame);
        this.ws?.send(JSON.stringify(frame));
      };

      this.ws.onclose = () => {
        this.log('ws close.');
      };

      this.ws.onerror = (ev) => {
        this.log('ws error. data=>', ev);
        reject(new Error('ws error'));
      };

      this.receive()
        .then((_path) => {
          resolve(_path);
        })
        .catch((_err) => {
          reject(_err);
        });
    });
  }

  /**
   * @param date  鉴权签名
   * @returns
   */
  private signature(date) {
    const signatureOrigin = `host: ${this.xfConfig.host}\ndate: ${date}\nGET ${this.xfConfig.uri} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(
      signatureOrigin,
      this.xfConfig.apiSecret
    );
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${this.xfConfig.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authStr = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(authorizationOrigin)
    );
    return authStr;
  }

  private log(...args): void {
    if (this.debug) {
      console.log('xftts debug:', ...args);
    }
  }
}

export default XfWsTTS;

/**
 * demo code
 */
// (async () => {
//   const xfWsTTS = new XfWsTTS(
//     {
//       appId: 'appid',
//       apiSecret: 'apisecret',
//       apiKey: 'apikey'
//     },
//     process.cwd()
//   );

//   if (await xfWsTTS.checkConfig()) {
//     xfWsTTS
//       .send('你好，我的朋友！')
//       .then((_path) => {
//         console.log('audio save path=>', _path);
//       })
//       .catch((err) => {
//         console.error('audio error =>', err);
//       });
//   }
// })();
