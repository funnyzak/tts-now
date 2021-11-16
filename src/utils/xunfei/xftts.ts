const CryptoJS = require('crypto-js');
const WebSocket = require('ws');
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
 * 合成选项
 * https://www.xfyun.cn/doc/tts/online_tts/API.html#%E6%8E%A5%E5%8F%A3%E8%A6%81%E6%B1%82
 */
export interface XfTtsOption {
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
  // 是否debug
  debug: boolean = false;

  // 声明一个Socket
  ws: WebSocket;

  // 获取当前时间 RFC1123格式
  rfcNow: string = new Date().toUTCString();

  // 讯飞配置
  config: XfWsConfig;

  constructor(xfwsConfig: XfWsConfig, debug: boolean = false) {
    this.config = xfwsConfig;
    this.debug = debug;
    this.checkConfig();

    const wssUrl = `${this.config.hostUrl
    }?authorization=${
      this.signature(this.rfcNow)
    }&date=${
      this.rfcNow
    }&host=${
      this.config.host}`;
    this.log('Wss URL', wssUrl);
    this.ws = new WebSocket(wssUrl);
  }

  /**
   *
   * @param text 要合成的文本
   */
  send(text: string) {
    const frame = {
      // 填充common
      common: {
        app_id: this.config.appId
      },
      // 填充business
      business: {
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: 'xiaoyan',
        tte: 'UTF8'
      },
      // 填充data
      data: {
        text: Buffer.from(text).toString('base64'),
        status: 2
      }
    };
    this.ws.send(JSON.stringify(frame));
  }

  // 保存文件
  save(data) {
    fs.writeFile('./test.pcm', data, { flag: 'a' }, (err) => {
      if (err) {
        this.log(`save error: ${err}`);
        return;
      }

      this.log('文件保存成功');
    });
  }

  /**
   * @param date  鉴权签名
   * @returns
   */
  signature(date) {
    const signatureOrigin = `host: ${this.config.host}\ndate: ${date}\nGET ${this.config.uri} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(
      signatureOrigin,
      this.config.apiSecret
    );
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${this.config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authStr = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(authorizationOrigin)
    );
    return authStr;
  }

  /**
   * 检查配置
   */
  checkConfig() {
    if (!this.config.host) {
      this.config.host = 'tts-api.xfyun.cn';
    }
    if (!this.config.uri) {
      this.config.uri = '/v2/tts';
    }
    if (!this.config.hostUrl) {
      this.config.hostUrl = `wss://${this.config.host}${this.config.uri}`;
    }
  }

  log(...args): void {
    if (this.debug) {
      console.log('xftts debug:', ...args);
    }
  }
}

export default XfWsTTS;
