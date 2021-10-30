import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { useState } from 'react';
import {
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FolderOpenFilled,
  FileTextOutlined,
  SyncOutlined
} from '@ant-design/icons';
import {
  Button, Table, Tag, Space, Input, Tooltip, Modal
} from 'antd';
import useAppSetting from '@/hook/appHook';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MainWrapper = styled.div`
  height: calc(100vh - 80px - 115px - 10px) !important;
  border: 1px solid #f4f6fa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const tableStyle = css`
  width: 100%;
  height: calc(100vh - 80px - 115px - 30px - 60px) !important;
  overflow-y: auto;
`;

enum FileConvertStatus {
  READY = '就绪',
  PROCESS = '处理',
  FAIL = '错误',
  SUCCESS = '成功'
}

interface FileInfoProp {
  key: number;
  filePath: string;
  fileName: string;
  textContent: string;
  status: FileConvertStatus;
  wordCount: number;
  error?: string;
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
    <Button type="primary" css={{ width: '145px' }} size="large">
      选择文件夹
    </Button>
  </MainWrapper>
);

const OutPutPathSelectComponent: React.FC<{}> = () => (
  <div>
    <Input
      defaultValue=""
      placeholder="请选择或填写合成文件保存的文件夹路径.."
      css={{ padding: '0', border: '0', borderTop: '1px solid #f4f6fa' }}
      size="large"
      prefix={(
        <Button type="primary" size="large">
          选择保存输出目录
        </Button>
      )}
    />
  </div>
);

const ConvertFilesComponent: React.FC<FileListProp> = ({ fileList }) => {
  const [currentRow, setCurrentRow] = useState<FileInfoProp>();

  const showTxtDialog = (data: FileInfoProp) => {
    Modal.info({
      title: `预览「${data.fileName}」`,
      okText: '关闭预览',
      maskClosable: true,
      bodyStyle: { textAlign: 'left' },
      centered: true,
      keyboard: true,
      icon: <FileTextOutlined />,
      content: <pre>{data.textContent}</pre>,
      onOk() {}
    });
  };

  const actionHandler = (action: string, data: FileInfoProp) => {
    setCurrentRow(data);

    if (action === 'play') {
      console.log(action);
    } else if (action === 'open') {
      console.log(action);
    } else if (action === 'txt') {
      showTxtDialog(data);
    }
  };

  fileList?.forEach((value, index) => {
    value.key = index + 1;
  });

  return (
    <MainWrapper>
      <Table
        css={tableStyle}
        sticky
        dataSource={fileList}
        rowClassName={(row: FileInfoProp) => (row.key % 2 === 0 ? 'hight-bg' : '')}
        pagination={false}
      >
        <Table.Column title="序号" dataIndex="key" key="key" width={58} />
        <Table.Column
          title="文件"
          dataIndex="fileName"
          key="fileName"
          render={(_value: string, _row: FileInfoProp) => (
            <div
              role="button"
              tabIndex={_row.key}
              onMouseDown={() => actionHandler('txt', _row)}
            >
              <FileTextOutlined />
              {' '}
              {_value}
            </div>
          )}
        />
        <Table.Column
          title="字符"
          dataIndex="wordCount"
          key="wordCount"
          width={80}
          render={(value: number) => (
            <>
              {value}
              {' '}
              个
            </>
          )}
        />
        <Table.Column
          title="耗时"
          dataIndex="elapsed"
          key="elapsed"
          width={80}
          render={(value: number) => (
            <>
              {value}
              {' '}
              秒
            </>
          )}
          sorter={(a: FileInfoProp, b: FileInfoProp) => (a.elapsed || 0) - (b.elapsed || 0)}
        />
        <Table.Column
          title="状态"
          dataIndex="status"
          key="status"
          width={100}
          render={(status: FileConvertStatus, row: FileInfoProp) => (
            <>
              <Tooltip title={row.error} color="red">
                <Tag
                  icon={
                    status === FileConvertStatus.PROCESS ? (
                      <SyncOutlined spin />
                    ) : null
                  }
                  color={
                    status === FileConvertStatus.PROCESS
                      ? 'cyan'
                      : status === FileConvertStatus.SUCCESS
                        ? 'success'
                        : status === FileConvertStatus.FAIL
                          ? 'error'
                          : 'blue'
                  }
                >
                  {status.toString()}
                </Tag>
              </Tooltip>
            </>
          )}
        />
        <Table.Column
          title="操作"
          width={120}
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
      <OutPutPathSelectComponent />
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
      key: 1,
      filePath: '/path/大同定.txt',
      fileName: '大同定.txt',
      textContent: `你好你好你好你好你好你好你好你好你好你好你好你好你好你好
      你好
      你好
      你好你好`,
      wordCount: 2,
      elapsed: 5,
      status: FileConvertStatus.READY
    },
    {
      key: 1,
      filePath: '/path/大同定.txt',
      fileName: '大同大同定大同定大同定大同定大同定.txt',
      textContent: '你好',
      wordCount: 2,
      elapsed: 20,
      status: FileConvertStatus.PROCESS
    },
    {
      key: 1,
      filePath: '/path/大同定.txt',
      fileName: '大同定.txt',
      textContent: '你好',
      wordCount: 2,
      elapsed: 30,
      status: FileConvertStatus.FAIL,
      error: '网络遇到错误'
    },
    {
      key: 1,
      filePath: '/path/大同定.txt',
      fileName: '大同定.txt',
      textContent: '你好',
      wordCount: 2,
      elapsed: 0,
      status: FileConvertStatus.SUCCESS
    },
    {
      key: 1,
      filePath: '/path/大同定.txt',
      fileName: '大同定.txt',
      textContent: '你好',
      wordCount: 2,
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
          <Space>
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              css={{
                backgroundColor: '#748bae',
                border: '0'
              }}
              size="large"
            >
              清空
            </Button>
            <Button type="primary" icon={<RedoOutlined />} size="large">
              开始转换
            </Button>
          </Space>
        </div>
      </div>
      <MangageFilesComponent fileList={fileList} />
    </Wrapper>
  );
};

export default Index;
