import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { RedoOutlined, DeleteOutlined } from '@ant-design/icons';
import useAppSetting from '@/hook/appHook';
import { voiceTypeList } from '@/config';

const { TextArea } = Input;

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
`;

interface FileInfoProp {
  filePath: string;
  complete: boolean;
  fileName: string;
  audioUrls?: Array<string>;
  audioPaths?: Array<string>;
}

interface FileListProp {
  fileList: Array<FileInfoProp>;
}

// const FileConvertComponent: React.FC<FileListProp> = ({ fileList }) => {

// }

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [fileList, setFileList] = useState<FileListProp>();
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
      {/* <FileConvertComponent fileList={fileList}> */}
    </Wrapper>
  );
};

export default Index;
