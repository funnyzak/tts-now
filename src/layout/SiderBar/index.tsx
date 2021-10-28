/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Button, Affix } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useState } from 'react';
import Header from './Header';
import Avatar from './Avatar';
import AudioSet from './Audio';

const Wrapper = styled.div`
  width: 280px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Wrapper2 = styled.div`
  width: 280px;
  height: calc(100vh - 80px - 60px);
  padding: 0 20px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const Index = () => {
  const [btnBottom] = useState(0);

  return (
    <Wrapper>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <Wrapper2>
        <Avatar />
        <AudioSet />
      </Wrapper2>
      <Affix offsetBottom={btnBottom}>
        <div
          css={{
            width: '280px',
            height: '60px',
            padding: '10px 20px',
            backgroundColor: '#fff'
          }}
        >
          <Button
            css={{ width: '100%', borderRadius: '5px' }}
            type="primary"
            icon={<SettingOutlined />}
            size="large"
          >
            配置密钥
          </Button>
        </div>
      </Affix>
    </Wrapper>
  );
};

export default Index;
