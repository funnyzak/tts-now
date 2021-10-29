import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
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

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [singleTxt, setSingleTxt] = useState(
    !appSetting.singleTxt
      ? voiceTypeList[appSetting.voiceSetIndex].text
      : appSetting.singleTxt
  );

  useEffect(() => {
    // if (
    //   singleTxt
    //   && singleTxt !== voiceTypeList[appSetting.voiceSetIndex].text
    // ) {
    setAppSetting({ singleTxt: voiceTypeList[appSetting.voiceSetIndex].text });
    // }
  }, [singleTxt, appSetting.voiceSetIndex]);

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
        <div css={{ fontSize: '24px', color: '#333' }}>文字转语音</div>
        <div>
          <Button
            type="primary"
            css={{
              backgroundColor: '#748bae',
              border: '0',
              borderRadius: '5px'
            }}
            size="large"
            icon={<ReloadOutlined />}
          >
            转换
          </Button>
          <Button
            type="primary"
            css={{ width: '148px;', marginLeft: '10px', borderRadius: '5px' }}
            size="large"
          >
            导出
          </Button>
        </div>
      </div>
      <div>
        <TextArea
          css={{ height: 'calc(100vh - 56px - 75px - 80px) !important' }}
          // value={appSetting.singleTxt}
          disabled={false}
        />
      </div>
    </Wrapper>
  );
};

export default Index;
