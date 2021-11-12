import React, { useState } from 'react';
import {
  Modal, Form, Input, message, Spin
} from 'antd';
import useAppSetting from '@/hook/appHook';
import * as core from '@/utils/core';

interface IDialogProp {
  closeCallBack: () => void;
}

const Index: React.FC<IDialogProp> = ({ closeCallBack }) => {
  const [form] = Form.useForm();
  const { appSetting, setAppSetting } = useAppSetting();
  const [spinning, setSpinning] = useState<boolean>(false);
  const [aliSetting, setAliSetting] = useState(appSetting.aliSetting);

  const valuesChange = (_formValues, _allFormValues) => {
    setAliSetting(_allFormValues);
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
        title="阿里云配置"
        centered
        okText="确定"
        cancelText="取消"
        visible
        onOk={submitChange}
        onCancel={() => closeCallBack()}
        width={300}
      >
        <Spin tip="验证中..." spinning={spinning}>
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
        </Spin>
      </Modal>
    </>
  );
};

export default Index;
