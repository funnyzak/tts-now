import { Button, Affix } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useState } from 'react';
import Header from './Header';
import Avatar from './Avatar';
import AudioSet from './Audio';
import { SetttingKeyDialog } from '../Dialog';

const Wrapper = styled.div`
  width: 280px;
  height: 100vh;
  border-right: 1px solid #f4f6fa;
  overflow: hidden;
`;

const Wrapper2 = styled.div`
  width: 280px;
  height: calc(100vh - 60px - 80px - 60px);
  padding: 0 20px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const settingButtonStyle = css`
  width: 280px;
  height: 60px;
  padding: 12px 20px 0;
  border-right: 1px solid #f4f6fa;
  background-color: #fff;
`;

const Index = () => {
  const [btnBottom] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  return (
    <Wrapper>
      <Affix offsetTop={0}>
        <div>
          <Header />
          <div css={{ padding: '0 20px' }}>
            <Avatar />
          </div>
        </div>
      </Affix>
      <Wrapper2>
        <AudioSet />
      </Wrapper2>
      <Affix offsetBottom={btnBottom}>
        <div css={settingButtonStyle}>
          <Button
            css={{ width: '100%' }}
            type="primary"
            icon={<SettingOutlined />}
            size="large"
            onClick={() => {
              setShowSetting(true);
            }}
          >
            配置
          </Button>
        </div>
      </Affix>
      {showSetting ? (
        <SetttingKeyDialog
          closeCallBack={() => {
            setShowSetting(false);
          }}
        />
      ) : (
        <div />
      )}
    </Wrapper>
  );
};

export default Index;
