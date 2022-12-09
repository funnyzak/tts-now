import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
// https://github.com/justinmc/react-audio-player
import {
  ExportOutlined,
  LoadingOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import {
  Button, Form, Input, message, Space
} from 'antd'
import ReactAudioPlayer from 'react-audio-player'
import useAppSetting from '@/hook/app'
import { TtsFileStatus } from '@/type/enums'
import * as core from '@/utils/core'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const actionButtonStyle = css`
  display: flex;
  justify-content: space-between;
  height: 115px;
  align-items: center;
`

const singleTxtStyle = {
  height: 'calc(100vh - 80px - 115px - 15px) !important',
  padding: '15px',
  margin: 0,
  overflow: 'hidden',
  marginBottom: '15px',
  lineHeight: '22px !important'
}

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting()

  const getSingleTxt = () => (appSetting.customSetting.singleTxt
    && appSetting.customSetting.singleTxt !== null
    && appSetting.customSetting.singleTxt.length > 0
    && core.currentSpeaker(appSetting).text !== appSetting.customSetting.singleTxt
    ? appSetting.customSetting.singleTxt
    : core.currentSpeaker(appSetting).text)

  const [singleTxt] = useState(getSingleTxt())
  const singleFormRef: any = useRef(null)
  const [singleTtsFile, setSingleTtsFile] = useState<APP.TtsFileInfo>()
  const [audioPlayer, setAudioPlayer] = useState<any>()

  const singleTextChange = (e) => {
    setAppSetting({
      customSetting: Object.assign(appSetting.customSetting, {
        singleTxt: e.target.value
      })
    })

    setSingleTtsFile({
      textContent: e.target.value,
      status: TtsFileStatus.READY,
      wordCount: 0
    })
  }

  const [processing, setProcessing] = useState<boolean>(false)
  const playHandle = async () => {
    if (!core.ttsRunCheck(appSetting)) return

    if (singleTtsFile?.audioUrl) {
      core.logger(audioPlayer)
      // 继续播放
      audioPlayer.audioEl.current.play()
      return
    }

    const txt = singleFormRef.current.getFieldsValue().singleTxt
    if (core.isNullOrEmpty(txt)) {
      message.error('请设置合成内容')
    }
    if (
      singleTtsFile?.status
      && singleTtsFile?.status === TtsFileStatus.PROCESS
    ) {
      message.warning('正在准备播放..')
    }

    setProcessing(true)

    core.ttsTasksRun(
      appSetting,
      [{ textContent: txt, status: TtsFileStatus.READY }],
      (current: APP.TtsFileInfo) => {
        setSingleTtsFile(current)
        if (current.status === TtsFileStatus.PROCESS) return

        setProcessing(false)
        if (current.status === TtsFileStatus.FAIL) {
          message.error(current.error?.message)
        }
      }
    )
  }

  const exportHandle = () => {
    if (
      !singleTtsFile
      || core.isNullOrEmpty(singleTtsFile)
      || core.isNullOrEmpty(singleTtsFile.audioUrl)
    ) {
      message.error('没有可导出的内容')
      return
    }

    core.selectDirection('select_export_path', (outPath) => {
      singleTtsFile.savePath = outPath
      singleTtsFile.saveName = `${appSetting.ttsSetting.engine.toString()}_${
        core.currentSpeaker(appSetting).speaker
      }_${singleTtsFile.textContent.substring(0, 7)}_${new Date().getTime()}.${
        singleTtsFile.ttsSetting?.format || 'mp3'
      }`
      setSingleTtsFile(singleTtsFile)
      core.exportAudioFile(singleTtsFile)
    })
  }

  useEffect(() => {
    if (
      singleFormRef
      && singleFormRef.current !== null
      && singleFormRef.current !== undefined
    ) {
      singleFormRef.current.setFieldsValue({ singleTxt: getSingleTxt() })
      setSingleTtsFile({
        textContent: getSingleTxt(),
        status: TtsFileStatus.READY,
        wordCount: 0
      })
    }
  }, core.ttsUseEffectDeps(appSetting.ttsSetting))

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
  )
}

export default Index
