import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { useState } from 'react';
import {
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FolderOpenFilled
} from '@ant-design/icons';
import {
  Button, Table, Tag, Space
} from 'antd';
import useAppSetting from '@/hook/appHook';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const MainWrapper = styled.div`
  height: calc(100vh - 80px - 115px - 30px) !important;
  border: 1px solid #f4f6fa;
  display: flex;
`;

enum FileConvertStatus {
  READY = '待转换',
  PROCESS = '合成中',
  FAIL = '失败',
  SUCCESS = '成功'
}

interface FileInfoProp {
  key: React.Key;
  filePath: string;
  fileName: string;
  textContent: string;
  status: FileConvertStatus;
  wordCount: number;
  elapsed?: number;
  audioUrls?: Array<string>;
  audioPaths?: Array<string>;
}

interface FileListProp {
  fileList?: Array<FileInfoProp>;
}

const SelectFilesComponent: React.FC<{}> = () => (
  <MainWrapper
    css={css`
      align-items: center;
      justify-content: center;
      background-color: #f4f6fa;
    `}
  >
    <Button
      type="primary"
      css={{ width: '145px;', borderRadius: '5px' }}
      size="large"
    >
      选择文件夹
    </Button>
  </MainWrapper>
);

const ConvertFilesComponent: React.FC<FileListProp> = ({ fileList }) => {
  const actionHandler = (action: string, data: FileInfoProp) => {
    console.log(action, data);
    if (action === 'play') {
      console.log(action);
    } else if (action === 'open') {
      console.log(action);
    }
  };

  return (
    <MainWrapper>
      {fileList !== undefined}
      <Table dataSource={fileList} css={{ width: '100%' }} pagination={false}>
        <Table.Column title="文件名" dataIndex="fileName" key="fileName" />
        <Table.Column title="字符数" dataIndex="wordCount" key="wordCount" />
        <Table.Column title="合成耗时" dataIndex="elapsed" key="elapsed" />
        <Table.Column
          title="状态"
          dataIndex="status"
          key="status"
          render={(status: FileConvertStatus) => (
            <>
              <Tag color="success">{status.toString()}</Tag>
            </>
          )}
        />
        <Table.Column
          title="操作"
          key="action"
          render={(_txt, data: FileInfoProp) => (
            <Space size="middle">
              <PlayCircleOutlined
                onClick={() => actionHandler('play', data)}
                alt="播放音频"
                style={{
                  color:
                    data.status === FileConvertStatus.SUCCESS
                      ? '#52c41a'
                      : '#ccc'
                }}
              />
              <FolderOpenFilled
                onClick={() => actionHandler('open', data)}
                alt="打开原文件"
                style={{ color: '#414e62' }}
              />
            </Space>
          )}
        />
      </Table>
    </MainWrapper>
  );
};

const MangageFilesComponent: React.FC<FileListProp> = ({ fileList }) => {
  if (fileList !== undefined && fileList !== null && fileList.length > 0) {
    return <ConvertFilesComponent fileList={fileList} />;
  }
  return <SelectFilesComponent />;
};

MangageFilesComponent.defaultProps = {
  fileList: [
    {
      key: '1',
      filePath: '/path/大同定.txt',
      fileName: '大同定.txt',
      textContent: '你好',
      wordCount: 2,
      elapsed: 0,
      status: FileConvertStatus.READY
    },
    {
      key: '2',
      filePath: '/path/大同定.txt',
      fileName: '大同定e.txt',
      textContent: '你好e',
      wordCount: 3,
      elapsed: 0,
      status: FileConvertStatus.READY
    }
  ]
};
const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [fileList, setFileList] = useState<Array<FileInfoProp>>();

  return (
    <Wrapper>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          height: 115px;
          align-items: center;
        `}
      >
        <div css={{ fontSize: '24px', color: '#333' }}>批量转换</div>
        <div>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            css={{
              backgroundColor: '#748bae',
              border: '0',
              borderRadius: '5px'
            }}
            size="large"
          >
            清空
          </Button>
          <Button
            type="primary"
            icon={<RedoOutlined />}
            css={{ width: '148px;', marginLeft: '10px', borderRadius: '5px' }}
            size="large"
          >
            开始转换
          </Button>
        </div>
      </div>
      <MangageFilesComponent fileList={fileList} />
    </Wrapper>
  );
};

export default Index;
