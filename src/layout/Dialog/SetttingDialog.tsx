import React, { useState } from 'react';
import {
  Modal, Form, Input, Spin, Tabs, Radio
} from 'antd';
import useAppSetting from '@/hook/app';
import * as core from '@/utils/core';
import { TtsEngine } from '@/type/enums';

interface IDialogProp {
  closeCallBack: () => void;
}

const Index: React.FC<IDialogProp> = ({ closeCallBack }) => {
  const [form] = Form.useForm();

  const { appSetting, setAppSetting } = useAppSetting();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [engine] = useState<string>(
    appSetting.ttsSetting.engine
      ? appSetting.ttsSetting.engine.toString()
      : TtsEngine.ALIYUN.toString()
  );
  const [aliSetting, setAliSetting] = useState(appSetting.aliSetting);
  const [xfSetting, setXfSetting] = useState(appSetting.xfSetting);
  const [engineOptions] = useState([
    { label: '阿里云', value: TtsEngine.ALIYUN.toString() },
    { label: '讯飞', value: TtsEngine.XUNFEI.toString() }
  ]);

  const platformFormData = (_engine: TtsEngine, _platformObj) => {
    const platformFormObj = {};

    if (_platformObj) {
      Object.keys(_platformObj).forEach((v) => {
        platformFormObj[`${_engine.toString()}_${v}`] = _platformObj[v];
      });
    }
    return platformFormObj;
  };

  const formInialValues = {
    engine,
    ...platformFormData(TtsEngine.ALIYUN, appSetting.aliSetting),
    ...platformFormData(TtsEngine.XUNFEI, appSetting.xfSetting)
  };

  const valuesChange = (_formValues, _allFormValues) => {
    core.logger('_formValues', _formValues, '_allFormValues', _allFormValues);
  };

  const formPlatformSetting = (_engine: TtsEngine, _allFormValues) => {
    const platformObj = {};
    Object.keys(_allFormValues)
      .filter((v) => v.startsWith(_engine.toString()))
      .forEach((v) => {
        platformObj[v.replace(`${_engine}_`, '')] = _allFormValues[v];
      });
    return platformObj;
  };

  const submitChange = async () => {
    if (spinning) return;

    const formValues = form.getFieldsValue();
    setAliSetting(
      formPlatformSetting(TtsEngine.ALIYUN, formValues) as APP.AliSetting
    );
    setXfSetting(
      formPlatformSetting(TtsEngine.XUNFEI, formValues) as APP.XfSetting
    );

    core.logger('ali setting:', aliSetting, 'xf setting:', xfSetting);
    // return;

    setSpinning(true);
    if (!(await core.checkAliSettingNetwork(aliSetting, true))) {
      setSpinning(false);
      return;
    }

    setAppSetting({ aliSetting });
    closeCallBack();
  };

  return (
    <>
      <Modal
        title="应用配置"
        centered
        okText="保存配置"
        cancelText="取消"
        visible
        onOk={submitChange}
        onCancel={() => closeCallBack()}
        width={500}
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
              <Radio.Group options={engineOptions} value={engine} />
            </Form.Item>
            <Tabs defaultActiveKey={engine} tabPosition="top">
              <Tabs.TabPane
                tab={<span>阿里云</span>}
                key={TtsEngine.ALIYUN.toString()}
              >
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
                  <Input placeholder="请输入AccessKeyId" />
                </Form.Item>
                <Form.Item
                  name={`${TtsEngine.ALIYUN.toString()}_accessKeySecret`}
                  required
                  label="AccessKeySecret"
                  tooltip={{ title: '阿里云账号API密钥' }}
                >
                  <Input.Password placeholder="请输入AccessKeySecret" />
                </Form.Item>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<span>讯飞语音</span>}
                key={TtsEngine.XUNFEI.toString()}
              >
                <Form.Item
                  name={`${TtsEngine.XUNFEI.toString()}_appId`}
                  label="appId"
                  required
                  tooltip="需要讯飞后台创建项目获取"
                >
                  <Input placeholder="请输入APPID" />
                </Form.Item>
                <Form.Item
                  required
                  name={`${TtsEngine.XUNFEI.toString()}_apiSecret`}
                  label="apiSecret"
                  tooltip={{ title: '讯飞账号API密钥' }}
                >
                  <Input placeholder="请输入APISecret" />
                </Form.Item>
                <Form.Item
                  name={`${TtsEngine.XUNFEI.toString()}_apiKey`}
                  required
                  label="apiKey"
                  tooltip={{ title: '讯飞账号API Key' }}
                >
                  <Input.Password placeholder="请输入APIKey" />
                </Form.Item>
              </Tabs.TabPane>
            </Tabs>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default Index;
