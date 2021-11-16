import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Menu, Dropdown, Typography, Tooltip
} from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import useAppSetting, { getVoiceTypeList, currentSpeaker } from '@/hook/app';
import styles from './index.module.scss';

const VoiceSelectComponent = (props: any) => {
  const { voiceIndex, voiceSetCallBack } = props;
  return (
    <div className={styles.scenePanel}>
      <Typography.Title
        css={css`
          padding: 10px 0 10px 10px;
          border-bottom: 1px solid #eee;
        `}
        level={4}
      >
        场景选择
      </Typography.Title>
      <Menu
        className={styles.menus}
        onClick={voiceSetCallBack}
        selectedKeys={[voiceIndex]}
      >
        {getVoiceTypeList().map((voiceType, index) => (
          <Menu.Item
            key={voiceType.speakerId}
            css={{
              borderBottom: '1px solid #eee',
              height: '45px !important',
              margin: '0 auto !important'
            }}
            icon={(
              <img
                src={voiceType.img}
                css={{ height: '30px', width: 'auto' }}
              />
            )}
          >
            <Tooltip
              title={`${voiceType.scene}|${voiceType.language}`}
              placement="right"
              color="gold"
            >
              {index + 1}
              .
              {voiceType.speaker}
              ，
              {voiceType.speechType}
            </Tooltip>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();
  const [menuShow, setMenuShow] = useState<boolean>(false);

  const changeVoice = ({ key: voiceSetIndex }) => {
    appSetting.ttsSetting.speakerId = voiceSetIndex;
    setAppSetting(appSetting);
  };

  return (
    <>
      <Dropdown
        onVisibleChange={(show) => {
          setMenuShow(show);
        }}
        overlay={(
          <VoiceSelectComponent
            voiceIndex={appSetting.ttsSetting.speakerId}
            voiceSetCallBack={changeVoice}
          />
        )}
        trigger={['hover']}
      >
        <div className={styles.avatarWrapper}>
          <img
            css={{
              width: '80px',
              height: '80px',
              marginRight: '20px'
            }}
            src={currentSpeaker().img}
          />
          <div>
            <div
              css={css`
                margin: 5px 0 0 0;
                width: 130px;
                font-size: 13.5px;
                color: #000;
              `}
            >
              {currentSpeaker().speaker}
            </div>
            <div
              css={css`
                font-size: 13px;
                margin-top: 5px;
                color: #666;
              `}
            >
              {currentSpeaker().speechType}
            </div>
          </div>
          <div>{!menuShow ? <CaretDownOutlined /> : <CaretUpOutlined />}</div>
        </div>
      </Dropdown>
    </>
  );
};

export default Index;
