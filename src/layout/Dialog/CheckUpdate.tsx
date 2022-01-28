import React, { useState } from 'react';
import { Modal } from 'antd';
import packageInfo from '../../../package.json';

const RP = require('request-promise');

function requestVersion() {}
const Index: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newVersion] = useState<string>('1.0.0');
  const [oldVersion] = useState<string>(packageInfo.version);
  const [updateContent] = useState<string>('细节优化，BUG修复');

  const okHandler = () => {};

  const cancelHandler = () => {};

  return (
    <>
      <Modal
        title="有新版本了"
        centered
        okText="更新"
        cancelText="暂不更新"
        visible={showUpdate}
        onOk={okHandler}
        onCancel={cancelHandler}
        width={500}
      >
        <p>
          检查到新版本
          {' '}
          {{ newVersion }}
          ，当前版本
          {' '}
          {{ oldVersion }}
          ，请及时更新。安装新版本前请先卸载旧版本！
        </p>
        <p>
          更新内容：
          {{ updateContent }}
        </p>
      </Modal>
    </>
  );
};

export default Index;
