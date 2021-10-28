import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import Header from './Header';
import Avatar from './Avatar';
import AudioSet from './Audio';

const Wrapper = styled.div`
  width: 280px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Wrapper2 = styled.div`
  width: 240px;
  height: calc(100% - 80px);
  margin-left: 20px;
  overflow-y: auto;
`;

const Index = () => {
  const size = 'large';
  return (
    <Wrapper>
      <Header />
      <Wrapper2>
        <Avatar />
        <AudioSet />
        <Button type="primary" icon={<SettingOutlined />} size={size}>
          配置密钥
        </Button>
      </Wrapper2>
    </Wrapper>
  );
};

export default Index;
