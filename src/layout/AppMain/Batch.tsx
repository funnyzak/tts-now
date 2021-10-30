import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import { App, ipcRenderer } from 'electron';
import fs from 'fs';

import {
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FolderOpenFilled,
  FileTextOutlined,
  FileAddOutlined,
  SmileOutlined,
  SyncOutlined
} from '@ant-design/icons';
import {
  Button,
  Table,
  Tag,
  Space,
  Input,
  Tooltip,
  Modal,
  Row,
  Col
} from 'antd';
import { TtsFileStatus } from '@/type/enums';
import { EventEmitter } from '@/config';
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

interface FileListProp {
  fileList?: Array<APP.TtsFileInfo>;
}

/**
 * 获取转换对象列表
 * @param files 文件路径集合
 * @returns
 */
const readFileList = (files: Array<string>): Array<APP.TtsFileInfo> => {
  if (files.length === 0) return [];

  console.log('read files:', files);

  const ttsFiles: Array<APP.TtsFileInfo> = [];
  files.forEach((v) => {
    ttsFiles.push({
      filePath: v,
      fileName: '',
      textContent: '',
      status: TtsFileStatus.READY,
      wordCount: 0
    });
  });
  return ttsFiles;
};

interface ICallBackFileListProp {
  callback: (res: Array<APP.TtsFileInfo>) => void;
}

const SelectFilesComponent: React.FC<ICallBackFileListProp> = ({
  callback
}) => {
  const selectFiles = () => {
    const actionName = 'select_tts_files';

    ipcRenderer.once(EventEmitter.SELECTED_FILES, (_event, arg) => {
      console.log('selected files:', arg, _event);

      if (arg.action === actionName && !arg.data.canceled) {
        callback(readFileList(arg.data.filePaths));
      }
    });

    ipcRenderer.send(EventEmitter.SELECT_FILES, {
      action: actionName,
      config: {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: '文件', extensions: ['txt', 'text'] }]
      }
    });
  };

  return (
    <MainWrapper
      css={css`
        align-items: center;
        justify-content: center;
        background-color: #f4f6fa;
      `}
    >
      <Button
        type="primary"
        icon={<FileAddOutlined />}
        css={{ width: '145px' }}
        size="large"
        onClick={selectFiles}
      >
        选择文本文件
      </Button>
    </MainWrapper>
  );
};

const OutPutPathSelectComponent: React.FC<{}> = () => {
  const [savePath, setSavePath] = useState();

  const selectPath = () => {
    const actionName = 'select_tts_path';
    ipcRenderer.once(EventEmitter.SELECTED_FILES, (_event, arg) => {
      console.log('selected path:', arg, _event);
      if (arg.action === actionName && !arg.data.canceled) {
        setSavePath(arg.data.filePaths[0]);
      }
    });

    ipcRenderer.send(EventEmitter.SELECT_FILES, {
      action: actionName,
      config: {
        title: '选择输出路径',
        properties: ['openDirectory']
      }
    });
  };
  return (
    <div>
      <Input
        defaultValue={savePath}
        value={savePath}
        placeholder="请选择或填写保存路径.."
        css={{ padding: '0', border: '0', borderTop: '1px solid #f4f6fa' }}
        size="small"
        addonBefore="保存到："
        suffix={(
          <Button
            css={css`
              margin: 0;
            `}
            type="primary"
            size="large"
            onClick={selectPath}
          >
            设置输出文件夹
          </Button>
        )}
      />
    </div>
  );
};

const ConvertFilesComponent: React.FC<FileListProp> = ({ fileList }) => {
  const [currentRow, setCurrentRow] = useState<APP.TtsFileInfo>();

  const showTxtDialog = (data: APP.TtsFileInfo) => {
    Modal.info({
      title: `预览「${data.fileName}」`,
      okText: '关闭预览',
      maskClosable: true,
      bodyStyle: { textAlign: 'left' },
      centered: true,
      keyboard: true,
      icon: <FileTextOutlined />,
      content: <pre>{data.textContent}</pre>
    });
  };

  const actionHandler = (action: string, data: APP.TtsFileInfo) => {
    setCurrentRow(data);

    if (action === 'play') {
      console.log(action);
    } else if (action === 'open') {
      console.log(action);
    } else if (action === 'txt') {
      showTxtDialog(data);
    }
  };

  const tableChange = (_pagination, _filters, _sorter, _extra: any) => {
    // 重新设置row => key
    _extra.currentDataSource.map((_v, _i) => {
      _v.key = _i + 1;
      return _v;
    });
  };

  fileList?.forEach((value, index) => {
    value.key = index + 1;
  });

  const statusFilterConfig = Object.keys(TtsFileStatus).map((v) => ({
    text: TtsFileStatus[v].toString(),
    value: v
  }));

  return (
    <MainWrapper>
      <Table
        css={tableStyle}
        sticky
        dataSource={fileList}
        rowClassName={(row: APP.TtsFileInfo) => ((row.key || 0) % 2 === 0 ? 'hightight-bg' : '')}
        pagination={false}
        onChange={tableChange}
      >
        <Table.Column title="序号" dataIndex="key" key="key" width={80} />
        <Table.Column
          title="文件"
          dataIndex="fileName"
          key="fileName"
          render={(_value: string, _row: APP.TtsFileInfo) => (
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
          sorter={(a: APP.TtsFileInfo, b: APP.TtsFileInfo) => a.wordCount - b.wordCount}
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
            <>{value ? `${value} 秒` : <SmileOutlined />}</>
          )}
          sorter={(a: APP.TtsFileInfo, b: APP.TtsFileInfo) => (a.elapsed || 0) - (b.elapsed || 0)}
        />
        <Table.Column
          title="状态"
          dataIndex="status"
          key="status"
          width={100}
          filters={statusFilterConfig}
          onFilter={(val, data: APP.TtsFileInfo) => TtsFileStatus[val as string] === data.status}
          render={(status: TtsFileStatus, row: APP.TtsFileInfo) => (
            <>
              <Tooltip title={row.error} color="red">
                <Tag
                  icon={
                    status === TtsFileStatus.PROCESS ? (
                      <SyncOutlined spin />
                    ) : (
                      <span />
                    )
                  }
                  color={
                    status === TtsFileStatus.PROCESS
                      ? 'cyan'
                      : status === TtsFileStatus.SUCCESS
                        ? 'success'
                        : status === TtsFileStatus.FAIL
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
          render={(_txt, data: APP.TtsFileInfo) => (
            <Space size="middle">
              <PlayCircleOutlined
                onClick={() => actionHandler('play', data)}
                alt="播放音频"
                style={{
                  color:
                    data.status === TtsFileStatus.SUCCESS ? '#52c41a' : '#ccc'
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

interface MangageFilesComponentProp {
  fileList?: Array<APP.TtsFileInfo>;
  callback: (res: Array<APP.TtsFileInfo>) => void;
}

const MangageFilesComponent: React.FC<MangageFilesComponentProp> = ({
  fileList,
  callback
}) => {
  if (fileList !== undefined && fileList !== null && fileList.length > 0) {
    return <ConvertFilesComponent fileList={fileList} />;
  }
  return <SelectFilesComponent callback={callback} />;
};

const Index = () => {
  const [fileList, setFileList] = useState<Array<APP.TtsFileInfo>>();

  return (
    <Wrapper>
      <Row
        css={css`
          height: 115px;
        `}
        justify="space-between"
        align="middle"
      >
        <Col span={6} css={{ fontSize: '24px', color: '#333' }}>
          批量转换
        </Col>
        {!fileList || fileList.length === 0 ? null : (
          <Col span={12} css={{ textAlign: 'right' }}>
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
          </Col>
        )}
      </Row>
      <MangageFilesComponent
        fileList={fileList}
        callback={(files) => setFileList(files)}
      />
    </Wrapper>
  );
};

export default Index;
