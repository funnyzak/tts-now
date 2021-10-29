import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import useAppSetting from '@/hook/appHook';
import { voiceTypeList } from '@/config';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();

  const getSingleTxt = () => (appSetting.singleTxt
    && appSetting.singleTxt !== null
    && appSetting.singleTxt.length > 0
    && voiceTypeList[appSetting.voiceSetIndex].text !== appSetting.singleTxt
    ? appSetting.singleTxt
    : voiceTypeList[appSetting.voiceSetIndex].text);

  const [singleTxt] = useState(getSingleTxt());

  const singleTextChange = (e) => {
    setAppSetting({ singleTxt: e.target.value });
  };

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
        <Input.TextArea
          css={{
            height: 'calc(100vh - 56px - 75px - 80px) !important',
            padding: '15px'
          }}
          defaultValue={singleTxt}
          disabled={false}
          placeholder="请输入要合成的文字.."
          onChange={singleTextChange}
          allowClear
        />
      </div>
    </Wrapper>
  );
};

export default Index;
