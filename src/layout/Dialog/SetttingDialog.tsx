import {
  Button, Form, Input, Modal, Radio, Spin, Tabs
} from 'antd'
import React, { useState } from 'react'
import { resetConfig } from '@/config'
import useAppSetting from '@/hook/app'
import { TtsEngine } from '@/type/enums'
import * as core from '@/utils/core'

interface IDialogProp {
  closeCallBack: () => void
}

const Index: React.FC<IDialogProp> = ({ closeCallBack }) => {
  const [form] = Form.useForm()

  const { appSetting, setAppSetting } = useAppSetting()
  const [spinning, setSpinning] = useState<boolean>(false)
  const [engine, setEngine] = useState<string>(
    appSetting.ttsSetting.engine
      ? appSetting.ttsSetting.engine.toString()
      : TtsEngine.ALIYUN.toString()
  )
  const [engineOptions] = useState([
    { label: '阿里云', value: TtsEngine.ALIYUN.toString() },
    { label: '讯飞', value: TtsEngine.XUNFEI.toString() }
  ])

  const platformFormData = (_engine: TtsEngine, _platformObj) => {
    const platformFormObj = {}

    if (_platformObj) {
      Object.keys(_platformObj).forEach((v) => {
        platformFormObj[`${_engine.toString()}_${v}`] = _platformObj[v]
      })
    }
    return platformFormObj
  }

  const formInialValues = {
    engine,
    ...platformFormData(TtsEngine.ALIYUN, appSetting.aliSetting),
    ...platformFormData(TtsEngine.XUNFEI, appSetting.xfSetting)
  }

  const valuesChange = (_formValues, _allFormValues) => {
    core.logger('_formValues', _formValues, '_allFormValues', _allFormValues)
  }

  const engineChange = (e) => {
    setEngine(e.target.value)
  }

  const resetConfigHandler = () => {
    setAppSetting(resetConfig())
    closeCallBack()
  }

  const formPlatformSetting = (_engine: TtsEngine, _allFormValues) => {
    const platformObj = {}
    Object.keys(_allFormValues)
      .filter((v) => v.startsWith(_engine.toString()))
      .forEach((v) => {
        platformObj[v.replace(`${_engine}_`, '')] = _allFormValues[v]
      })
    return platformObj
  }

  const submitChange = async () => {
    if (spinning) return

    const formValues = form.getFieldsValue()
    const _aliSetting = formPlatformSetting(
      TtsEngine.ALIYUN,
      formValues
    ) as APP.AliSetting
    const _xfSetting = formPlatformSetting(
      TtsEngine.XUNFEI,
      formValues
    ) as APP.XfSetting

    core.logger('ali setting:', _aliSetting, 'xf setting:', _xfSetting)

    setSpinning(true)
    if (
      (formValues.engine === TtsEngine.ALIYUN.toString()
        && !(await core.checkAliSettingNetwork(_aliSetting, true)))
      || (formValues.engine === TtsEngine.XUNFEI.toString()
        && !(await core.checkXfSettingNetwork(_xfSetting, true)))
    ) {
      setSpinning(false)
      return
    }

    setAppSetting({
      aliSetting: _aliSetting,
      xfSetting: _xfSetting,
      ttsSetting: {
        ...appSetting.ttsSetting,
        engine: formValues.engine as TtsEngine
      }
    })
    closeCallBack()
  }

  return (
    <Modal
      title="应用配置"
      centered
      okText="保存配置"
      cancelText="取消"
      open
      width={500}
      onCancel={closeCallBack}
      footer={[
        <Button
          key="clear"
          css={{ float: 'left' }}
          onClick={resetConfigHandler}
          type="dashed"
          danger
        >
          清除配置
        </Button>,
        <Button key="cancel" onClick={() => closeCallBack()}>
          取消
        </Button>,
        <Button key="ok" type="primary" onClick={submitChange}>
          验证并应用配置
        </Button>
      ]}
    >
      <Spin tip="验证中..." spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
          initialValues={formInialValues}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onValuesChange={valuesChange}
        >
          <Form.Item
            name="engine"
            label="使用合成引擎"
            required
            tooltip="语音合成所使用的引擎"
          >
            <Radio.Group
              options={engineOptions}
              value={engine}
              onChange={engineChange}
            />
          </Form.Item>
          <Tabs
            defaultActiveKey={engine}
            activeKey={engine}
            tabPosition="top"
            items={[
              {
                label: '阿里云',
                key: TtsEngine.ALIYUN.toString(),
                children: (
                  <>
                    <Form.Item
                      name={`${TtsEngine.ALIYUN.toString()}_appKey`}
                      label="AppKey"
                      required
                      tooltip="需要阿里云后台创建项目获取"
                    >
                      <Input placeholder="请输入AppKey" />
                    </Form.Item>
                    <Form.Item
                      required
                      name={`${TtsEngine.ALIYUN.toString()}_accessKeyId`}
                      label="AccessKeyId"
                      tooltip={{ title: '阿里云账号API密钥' }}
                    >
                      <Input.Password placeholder="请输入AccessKeyId" />
                    </Form.Item>
                    <Form.Item
                      name={`${TtsEngine.ALIYUN.toString()}_accessKeySecret`}
                      required
                      label="AccessKeySecret"
                      tooltip={{ title: '阿里云账号API密钥' }}
                    >
                      <Input.Password placeholder="请输入AccessKeySecret" />
                    </Form.Item>
                  </>
                )
              },
              {
                label: '讯飞语音',
                key: TtsEngine.XUNFEI.toString(),
                children: (
                  <>
                    <Form.Item
                      name={`${TtsEngine.XUNFEI.toString()}_appId`}
                      label="APPID"
                      required
                      tooltip="需要讯飞后台创建项目获取"
                    >
                      <Input placeholder="请输入APPID" />
                    </Form.Item>
                    <Form.Item
                      name={`${TtsEngine.XUNFEI.toString()}_apiKey`}
                      required
                      label="APIKey"
                      tooltip={{ title: '讯飞账号API Key' }}
                    >
                      <Input.Password placeholder="请输入APIKey" />
                    </Form.Item>
                    <Form.Item
                      required
                      name={`${TtsEngine.XUNFEI.toString()}_apiSecret`}
                      label="APISecret"
                      tooltip={{ title: '讯飞账号API密钥' }}
                    >
                      <Input.Password placeholder="请输入APISecret" />
                    </Form.Item>
                  </>
                )
              }
            ]}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

export default Index
