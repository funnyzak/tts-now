import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Header from './Header';
import Avatar from './Avatar';
import AudioSet from './AudioSet';

const Wrapper = styled.div`
  width: 280px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Index = () => {
  const size = 'large';
  return (
    <Wrapper>
      <Header />
      <Avatar />
      <AudioSet />
      <Button type="primary" icon={<SettingOutlined />} size={size}>
        配置密钥
      </Button>
    </Wrapper>
  );
};

export default Index;
