import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { RedoOutlined, DeleteOutlined } from '@ant-design/icons';
import useAppSetting from '@/hook/appHook';
import { voiceTypeList } from '@/config';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const MainWrapper = styled.div`
  height: calc(100vh - 56px - 75px - 80px) !important;
  border: 1px solid #f4f6fa;
  display: flex;
`;

interface FileInfoProp {
  filePath: string;
  fileName: string;
  textContent: string;
  complete: boolean;
  audioUrls?: Array<string>;
  audioPaths?: Array<string>;
}

interface FileListProp {
  fileList?: Array<FileInfoProp>;
}

const SelectFilesComponent: React.FC<FileListProp> = ({ fileList }) => {
  if (fileList !== undefined && fileList !== null && fileList.length > 0) {
    return <MainWrapper>这是列表</MainWrapper>;
  }
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
        css={{ width: '145px;', borderRadius: '5px' }}
        size="large"
      >
        选择文件夹
      </Button>
    </MainWrapper>
  );
};

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [fileList, setFileList] = useState<Array<FileInfoProp>>();
  const [singleTxt, setSingleTxt] = useState(
    !appSetting.singleTxt
      ? voiceTypeList[appSetting.voiceSetIndex].text
      : appSetting.singleTxt
  );

  useEffect(() => {
    if (
      singleTxt
      && singleTxt !== voiceTypeList[appSetting.voiceSetIndex].text
    ) {
      setAppSetting({ singleTxt });
    }
  }, [singleTxt]);

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
      <SelectFilesComponent fileList={fileList} />
    </Wrapper>
  );
};

export default Index;
