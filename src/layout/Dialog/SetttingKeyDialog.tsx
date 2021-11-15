import React, { useState } from 'react';
import {
  Modal, Form, Input, Spin, Tabs
} from 'antd';
import useAppSetting from '@/hook/appHook';
import * as core from '@/utils/core';

interface IDialogProp {
  closeCallBack: () => void;
}

const Index: React.FC<IDialogProp> = ({ closeCallBack }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { appSetting, setAppSetting } = useAppSetting();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [aliSetting, setAliSetting] = useState(appSetting.aliSetting);
  const [xfSetting, setXfSetting] = useState(appSetting.xfSetting);

  const valuesChange = (_formValues, _allFormValues) => {
    setAliSetting(_allFormValues);
  };

  const valuesChangeXF = (_formValues, _allFormValues) => {
    setXfSetting(_allFormValues);
  };

  const submitChange = async () => {
    if (spinning) return;

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
        title="配置"
        centered
        okText="确定"
        cancelText="取消"
        visible
        onOk={submitChange}
        onCancel={() => closeCallBack()}
        width={500}
      >
        <Spin tip="验证中..." spinning={spinning}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={<span>阿里配置</span>} key="1">
              <Form
                form={form}
                layout="vertical"
                initialValues={aliSetting}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onValuesChange={valuesChange}
              >
                <Form.Item
                  name="appKey"
                  label="AppKey"
                  required
                  tooltip="需要阿里云后台创建项目获取"
                >
                  <Input placeholder="请输入AppKey" />
                </Form.Item>
                <Form.Item
                  required
                  name="accessKeyId"
                  label="AccessKeyId"
                  tooltip={{ title: '阿里云账号API密钥' }}
                >
                  <Input placeholder="请输入AccessKeyId" />
                </Form.Item>
                <Form.Item
                  name="accessKeySecret"
                  required
                  label="AccessKeySecret"
                  tooltip={{ title: '阿里云账号API密钥' }}
                >
                  <Input.Password placeholder="请输入AccessKeySecret" />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>讯飞配置</span>} key="2">
              <Form
                form={form2}
                layout="vertical"
                initialValues={xfSetting}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onValuesChange={valuesChangeXF}
              >
                <Form.Item
                  name="APPID"
                  label="APPID"
                  required
                  tooltip="需要讯飞后台创建项目获取"
                >
                  <Input placeholder="请输入APPID" />
                </Form.Item>
                <Form.Item
                  required
                  name="APISecret"
                  label="APISecret"
                  tooltip={{ title: '讯飞账号API密钥' }}
                >
                  <Input placeholder="请输入APISecret" />
                </Form.Item>
                <Form.Item
                  name="APIKey"
                  required
                  label="APIKey"
                  tooltip={{ title: '讯飞账号API Key' }}
                >
                  <Input.Password placeholder="请输入APIKey" />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Modal>
    </>
  );
};

export default Index;
