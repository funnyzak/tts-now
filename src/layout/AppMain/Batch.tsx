import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import { App, ipcRenderer, shell } from 'electron';
import fs from 'fs';
import path from 'path';
import ReactAudioPlayer from 'react-audio-player';

import {
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FolderOpenFilled,
  FileTextOutlined,
  FileAddOutlined,
  SmileOutlined,
  ExclamationCircleOutlined,
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
  message,
  Row,
  Col
} from 'antd';
import { voiceTypeList, IFIcon } from '@/config';
import * as core from '@/utils/core';
import { TtsFileStatus } from '@/type/enums';
import { EventEmitter } from '@/config';
import useAppSetting from '@/hook/appHook';
import { AliTtsComplete } from '@/utils/aliyun/alitts';

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

  core.logger('read files:', files);

  const ttsFiles: Array<APP.TtsFileInfo> = [];
  files.forEach((v) => {
    try {
      const textContent = fs.readFileSync(v, 'utf-8');
      ttsFiles.push({
        filePath: v,
        fileName: path.basename(v),
        textContent,
        status: TtsFileStatus.READY,
        wordCount: textContent.length
      });
    } catch (err) {
      core.logger(`读取文件【${v}】失败`, err);
    }
  });
  core.logger('read tts file after:', ttsFiles);
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
      core.logger('selected files:', arg, _event);

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

const OutPutPathSelectComponent: React.FC<{
  savePath: string;
  savePathCallBack: (path: string) => void;
}> = ({ savePath, savePathCallBack }) => {
  const selectPath = () => {
    core.selectDirection('select_tts_path', (outPath) => {
      savePathCallBack(outPath);
    });
  };
  return (
    <div>
      <Input
        defaultValue={savePath}
        value={savePath}
        placeholder="还没设置哦.."
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

interface ConvertFilesComponentProp {
  fileList: Array<APP.TtsFileInfo>;
  savePathCallBack: (path: string) => void;
  savePath: string;
}

const ConvertFilesComponent: React.FC<ConvertFilesComponentProp> = ({
  fileList,
  savePath,
  savePathCallBack
}) => {
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
      core.logger(action);
    } else if (action === 'open') {
      if (data.status !== TtsFileStatus.SUCCESS) {
        return;
      }
      shell.showItemInFolder(
        path.join(data?.savePath || '', data?.saveName || '')
      );
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
        <Table.Column title="序号" dataIndex="key" key="key" width={58} />
        <Table.Column
          title="文件"
          dataIndex="fileName"
          key="fileName"
          render={(_value: string, _row: APP.TtsFileInfo) => (
            <div
              role="button"
              css={{ cursor: 'pointer' }}
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
                alt="打开文件夹"
                style={{
                  color:
                    data.status === TtsFileStatus.SUCCESS ? '#414e62' : '#ccc'
                }}
              />
            </Space>
          )}
        />
      </Table>
      <OutPutPathSelectComponent
        savePath={savePath}
        savePathCallBack={savePathCallBack}
      />
    </MainWrapper>
  );
};

interface MangageFilesComponentProp {
  fileList?: Array<APP.TtsFileInfo>;
  callback: (res: Array<APP.TtsFileInfo>) => void;
  savePath: string;
  savePathCallBack: (res: string) => void;
}

const MangageFilesComponent: React.FC<MangageFilesComponentProp> = ({
  fileList,
  callback,
  savePath,
  savePathCallBack
}) => (
  <>
    {fileList !== undefined && fileList !== null && fileList.length > 0 ? (
      <ConvertFilesComponent
        fileList={fileList}
        savePath={savePath}
        savePathCallBack={savePathCallBack}
      />
    ) : (
      <SelectFilesComponent callback={callback} />
    )}
  </>
);

const defaultFileList = [
  {
    filePath: '/Users/potato/Desktop/你好朋友.txt',
    fileName: '你好朋友.txt',
    textContent: '你好啊，我的朋友！',
    status: TtsFileStatus.READY,
    wordCount: 9,
    key: 1
  },
  {
    filePath: '/Users/potato/Desktop/风.txt',
    fileName: '风.txt',
    textContent: '为站在烈烈风中',
    status: TtsFileStatus.READY,
    wordCount: 7,
    key: 2
  }
];

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [fileList, setFileList] = useState<Array<APP.TtsFileInfo>>(defaultFileList);
  const [aliTtsInstance] = useState(core.createAliTTS(appSetting.aliSetting));
  const [process, setProcess] = useState<boolean>(false);

  const runTask = async () => {
    if (!core.checkAliSetting(appSetting.aliSetting, true)) return;

    if (core.isNullOrEmpty(appSetting.customSetting.savePath)) {
      message.warn('请选择输出文件夹');
      return;
    }
    if (!fileList || fileList.length === 0) {
      message.warn('请选择要转换的文件');
      return;
    }

    if (!fs.existsSync(appSetting.customSetting.savePath || '')) {
      message.warn('保存路径不存在哦，清检查。');
      return;
    }

    if (process) {
      message.info('已经在处理了');
    }

    setProcess(true);
    setFileList(fileList.map((v) => ({ ...v, status: TtsFileStatus.READY })));

    // 开始所有转换任务
    for (const finfo of fileList) {
      finfo.ttsSetting = appSetting.ttsSetting;
      finfo.status = TtsFileStatus.READY;
      finfo.ttsStart = new Date().getTime();
      finfo.savePath = appSetting.customSetting.savePath;
      finfo.saveName = `${
        finfo.fileName?.split('.')[0]
      }_${new Date().getTime()}.${finfo.ttsSetting.format}`;

      try {
        finfo.taskId = await aliTtsInstance.task(finfo.textContent, {
          format: appSetting.ttsSetting.format,
          sample_rate: appSetting.ttsSetting.simpleRate,
          voice: voiceTypeList[appSetting.ttsSetting.voiceIndex].speakerId,
          volume: appSetting.ttsSetting.volumn,
          speech_rate: appSetting.ttsSetting.speedRate,
          pitchRate: appSetting.ttsSetting.pitchRate
        });
        finfo.status = TtsFileStatus.PROCESS;
      } catch (error) {
        core.logger(error);
        finfo.taskId = '';
        finfo.status = TtsFileStatus.FAIL;
        finfo.error = error;
      }
    }
    setFileList(fileList);

    const statusPull = async () => {
      for (const finfo of fileList) {
        if (finfo.status !== TtsFileStatus.PROCESS) {
          continue;
        }
        try {
          const aliTtsComplete: AliTtsComplete = await aliTtsInstance.status(
            finfo.taskId
          );

          if (!core.isNullOrEmpty(aliTtsComplete.audio_address)) {
            finfo.status = TtsFileStatus.SUCCESS;
            finfo.ttsEnd = new Date().getTime();
            finfo.audioUrl = aliTtsComplete.audio_address;
            core.downloadFile(finfo.audioUrl, finfo.savePath, {
              fileName: finfo.saveName
            });
          }
        } catch (error) {
          core.logger(error);
          finfo.taskId = '';
          finfo.status = TtsFileStatus.FAIL;
          finfo.error = error;
        }
      }
      setFileList(fileList);

      if (
        fileList.filter((v) => v.status === TtsFileStatus.PROCESS).length > 0
      ) {
        statusPull();
      } else {
        setProcess(false);
      }
    };

    statusPull();
  };

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
                onClick={() => {
                  Modal.confirm({
                    title: '确定',
                    icon: <ExclamationCircleOutlined />,
                    content: `确定清空当前 ${fileList.length} 个任务吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    centered: true,
                    onOk: () => {
                      setFileList([]);
                    }
                  });
                }}
              >
                清空
              </Button>
              <Button
                type="primary"
                icon={<RedoOutlined spin={process} />}
                size="large"
                onClick={runTask}
              >
                开始转换任务
              </Button>
            </Space>
          </Col>
        )}
      </Row>
      <MangageFilesComponent
        fileList={fileList}
        callback={(files) => setFileList(files)}
        savePath={appSetting.customSetting.savePath || ''}
        savePathCallBack={(_path) => {
          appSetting.customSetting.savePath = _path;
          setAppSetting(appSetting);
        }}
      />
    </Wrapper>
  );
};

export default Index;
