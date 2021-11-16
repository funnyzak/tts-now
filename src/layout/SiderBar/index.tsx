import { Button, Affix } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useState } from 'react';
import Header from './Header';
import Avatar from './Avatar';
import AudioSet from './Audio';
import { SetttingDialog } from '../Dialog';
import styles from './index.module.scss';

const Index = () => {
  const [btnBottom] = useState(0);
  const [showSetting, setShowSetting] = useState(true);
  return (
    <div className={styles.wrapper}>
      <Affix offsetTop={0}>
        <div>
          <Header />
          <div css={{ padding: '0 20px' }}>
            <Avatar />
          </div>
        </div>
      </Affix>
      <div className={styles.settingWrapper}>
        <AudioSet />
      </div>
      <Affix offsetBottom={btnBottom}>
        <div className={styles.settingButton}>
          <Button
            css={{ width: '100%' }}
            type="primary"
            icon={<SettingOutlined />}
            size="large"
            onClick={() => {
              setShowSetting(true);
            }}
          >
            平台配置
          </Button>
        </div>
      </Affix>
      {showSetting ? (
        <SetttingDialog
          closeCallBack={() => {
            setShowSetting(false);
          }}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default Index;
