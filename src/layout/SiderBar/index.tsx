import Header from './Header'
import Avatar from './Avatar'
import AudioSet from './AudioSet'
import SetttingKeyDialog from '../Dialog/SetttingKeyDialog'
import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const Index = () => {
  const size = 'large';
  return (
    <div>
      <Header />
      <Avatar />
      <AudioSet />
      <Button type="primary" icon={<SettingOutlined />} size={size}>
        配置密钥
      </Button>
    </div>)
};

export default Index
