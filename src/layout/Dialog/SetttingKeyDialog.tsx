import React, { useState } from 'react';
import {
  Modal, Form, Input, Button
} from 'antd';
import useAppSetting from '@/hook/appHook';

interface IDialogProp {
  closeCallBack: () => void;
}

const Index: React.FC<IDialogProp> = ({ closeCallBack }) => {
  const [form] = Form.useForm();
  const { appSetting, setAppSetting } = useAppSetting();

  const [appKey, setAppKey] = useState(appSetting.appKey);
  const [accessKeyId, setAccessKeyId] = useState(appSetting.accessKeyId);
  const [accessKeySecret, setAccessKeySecret] = useState(
    appSetting.accessKeySecret
  );

  return (
    <>
      <Modal
        title="配置"
        centered
        okText="确定"
        cancelText="取消"
        visible
        onOk={() => closeCallBack()}
        onCancel={() => closeCallBack()}
        width={300}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="AppKey" required tooltip="阿里云">
            <Input placeholder="请输入AppKey" value={appKey} />
          </Form.Item>
          <Form.Item
            required
            label="AccessKeyId"
            tooltip={{ title: 'Tooltip with customize icon' }}
          >
            <Input placeholder="请输入AccessKeyId" value={accessKeyId} />
          </Form.Item>
          <Form.Item required label="AccessKeySecret">
            <Input
              placeholder="请输入AccessKeySecret"
              value={accessKeySecret}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
