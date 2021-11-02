import styled from '@emotion/styled';
import { css } from '@emotion/react';
import {
  Input, Button, Form, Space, message
} from 'antd';
import {
  ExportOutlined,
  PlayCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { shell } from 'electron';
import path from 'path';
import ReactAudioPlayer from 'react-audio-player';
import useAppSetting from '@/hook/appHook';
import { voiceTypeList } from '@/config';
import * as core from '@/utils/core';
import { TtsFileStatus } from '@/type/enums';
import { AliTtsComplete } from '@/utils/aliyun/alitts';

// https://github.com/justinmc/react-audio-player

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const actionButtonStyle = css`
  display: flex;
  justify-content: space-between;
  height: 115px;
  align-items: center;
`;

const singleTxtStyle = {
  height: 'calc(100vh - 80px - 115px - 10px) !important',
  padding: '15px',
  margin: 0,
  overflow: 'hidden',
  marginBottom: '10px',
  lineHeight: '22px !important'
};

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();

  const getSingleTxt = () => (appSetting.customSetting.singleTxt
    && appSetting.customSetting.singleTxt !== null
    && appSetting.customSetting.singleTxt.length > 0
    && voiceTypeList[appSetting.ttsSetting.voiceIndex].text
      !== appSetting.customSetting.singleTxt
    ? appSetting.customSetting.singleTxt
    : voiceTypeList[appSetting.ttsSetting.voiceIndex].text);

  const [singleTxt] = useState(getSingleTxt());
  const singleFormRef: any = useRef(null);
  const [aliTtsInstance, setAliTtsInstance] = useState(
    core.createAliTTS(appSetting.aliSetting)
  );
  const [singleTtsFile, setSingleTtsFile] = useState<APP.TtsFileInfo>();
  const [audioPlayer, setAudioPlayer] = useState<any>();

  const singleTextChange = (e) => {
    setAppSetting({
      customSetting: Object.assign(appSetting.customSetting, {
        singleTxt: e.target.value
      })
    });

    setSingleTtsFile({
      textContent: e.target.value,
      status: TtsFileStatus.READY,
      wordCount: 0
    });
  };

  const [processing, setProcessing] = useState<boolean>(false);
  const playHandle = async () => {
    if (!core.checkAliSetting(appSetting.aliSetting, true)) return;

    if (singleTtsFile?.audioUrl) {
      core.logger(audioPlayer);
      // 继续播放
      audioPlayer.audioEl.current.play();
      return;
    }

    const txt = singleFormRef.current.getFieldsValue().singleTxt;
    if (core.isNullOrEmpty(txt)) {
      message.error('请设置合成内容');
    }
    if (
      singleTtsFile?.status
      && singleTtsFile?.status === TtsFileStatus.PROCESS
    ) {
      message.warn('正在准备播放..');
    }

    const ttsFileInfo: APP.TtsFileInfo = {
      ttsSetting: appSetting.ttsSetting,
      textContent: txt,
      status: TtsFileStatus.PROCESS,
      wordCount: txt.length,
      ttsStart: new Date().getTime()
    };
    setSingleTtsFile(ttsFileInfo);

    setProcessing(true);

    let rlt: AliTtsComplete;
    try {
      rlt = await aliTtsInstance.taskSync(
        txt,
        2,
        {
          format: appSetting.ttsSetting.format,
          sample_rate: appSetting.ttsSetting.simpleRate,
          voice: voiceTypeList[appSetting.ttsSetting.voiceIndex].speakerId,
          volume: appSetting.ttsSetting.volumn,
          speech_rate: appSetting.ttsSetting.speedRate,
          pitchRate: appSetting.ttsSetting.pitchRate
        },
        2
      );
    } catch (err) {
      core.logger('single error:', err);
      message.error(err);
      ttsFileInfo.status = TtsFileStatus.FAIL;
      setProcessing(false);
      return;
    }

    ttsFileInfo.ttsEnd = new Date().getTime();
    ttsFileInfo.audioUrl = rlt.audio_address;
    ttsFileInfo.status = TtsFileStatus.SUCCESS;
    ttsFileInfo.taskId = rlt.task_id;

    setSingleTtsFile(ttsFileInfo);
    setProcessing(false);
  };

  const exportHandle = () => {
    if (
      !singleTtsFile
      || core.isNullOrEmpty(singleTtsFile)
      || core.isNullOrEmpty(singleTtsFile.audioUrl)
    ) {
      message.error('没有可导出的内容');
      return;
    }

    core.selectDirection('select_export_path', (outPath) => {
      singleTtsFile.savePath = outPath;
      singleTtsFile.saveName = `${singleTtsFile.textContent.substring(
        0,
        7
      )}_${new Date().getTime()}.${singleTtsFile.ttsSetting?.format || 'mp3'}`;
      setSingleTtsFile(singleTtsFile);

      core.logger(singleTtsFile);

      core
        .downloadFile(singleTtsFile?.audioUrl || '', outPath, {
          fileName: singleTtsFile?.saveName
        })
        .then(() => {
          message.success('已成功导出');
          shell.showItemInFolder(
            path.join(
              singleTtsFile?.savePath || '',
              singleTtsFile?.saveName || ''
            )
          );
        });
    });
  };

  useEffect(() => {
    if (
      singleFormRef
      && singleFormRef.current !== null
      && singleFormRef.current !== undefined
    ) {
      singleFormRef.current.setFieldsValue({ singleTxt: getSingleTxt() });
      setSingleTtsFile({
        textContent: getSingleTxt(),
        status: TtsFileStatus.READY,
        wordCount: 0
      });
    }
  }, core.ttsUseEffectDeps(appSetting.ttsSetting));

  useEffect(() => {
    setAliTtsInstance(core.createAliTTS(appSetting.aliSetting));
  }, core.aliUseEffectDeps(appSetting.aliSetting));

  return (
    <Wrapper>
      <div css={actionButtonStyle}>
        <div css={{ fontSize: '24px', color: '#333' }}>文字转语音</div>
        <div>
          <Space>
            <Button
              type="primary"
              css={{
                backgroundColor: '#748bae',
                border: '0'
              }}
              size="large"
              icon={processing ? <LoadingOutlined /> : <PlayCircleOutlined />}
              onClick={playHandle}
            >
              立即播放
            </Button>
            {!singleTtsFile
            || core.isNullOrEmpty(singleTtsFile)
            || core.isNullOrEmpty(singleTtsFile.audioUrl) ? null : (
              <>
                <Button
                  type="primary"
                  size="large"
                  icon={<ExportOutlined />}
                  onClick={exportHandle}
                >
                  导出
                </Button>
                <ReactAudioPlayer
                  css={css`
                    display: none;
                  `}
                  src={singleTtsFile.audioUrl}
                  autoPlay
                  ref={(el) => setAudioPlayer(el)}
                />
              </>
              )}
          </Space>
        </div>
      </div>
      <Form ref={singleFormRef} initialValues={{ singleTxt }}>
        <Form.Item css={{ marginBottom: 0 }} name="singleTxt">
          <Input.TextArea
            css={singleTxtStyle}
            disabled={false}
            placeholder="请输入要合成的文字.."
            onChange={singleTextChange}
            allowClear
          />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default Index;
