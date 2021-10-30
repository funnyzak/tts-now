import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useState } from 'react';
import { Menu, Dropdown, Typography } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import useAppSetting from '@/hook/appHook';
import { voiceTypeList } from '@/config';

const Wrapper = styled.div`
  width: 100%;
  margin: 20px auto;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
`;

const scenePanelStyle = css`
  max-height: calc(100vh - 260px);
  overflow: hidden;
  border-size: border-box;
  border-radius: 5px;
  border: 1px solid #eee;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const sceneMenuStyle = css`
  border: 0;
  overflow-y: auto;
`;

const VoiceSelectComponent = (props: any) => {
  const { voiceIndex, voiceSetCallBack } = props;
  return (
    <div css={scenePanelStyle}>
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
        css={sceneMenuStyle}
        onClick={voiceSetCallBack}
        selectedKeys={[voiceIndex.toString()]}
      >
        {voiceTypeList.map((voiceType, index) => (
          <Menu.Item
            key={index.toString()}
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
            {index + 1}
            .
            {voiceType.speaker}
            ，
            {voiceType.speechType}
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
    appSetting.ttsSetting.sceneIndex = voiceSetIndex;
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
            voiceIndex={appSetting.ttsSetting.sceneIndex}
            voiceSetCallBack={changeVoice}
          />
        )}
        trigger={['click']}
      >
        <Wrapper>
          <img
            css={{
              width: '80px',
              height: 'auto',
              marginRight: '20px'
            }}
            src={voiceTypeList[appSetting.ttsSetting.sceneIndex].img}
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
              {voiceTypeList[appSetting.ttsSetting.sceneIndex].speaker}
            </div>
            <div
              css={css`
                font-size: 13px;
                margin-top: 5px;
                color: #666;
              `}
            >
              {voiceTypeList[appSetting.ttsSetting.sceneIndex].speechType}
            </div>
          </div>
          <div>{!menuShow ? <CaretDownOutlined /> : <CaretUpOutlined />}</div>
        </Wrapper>
      </Dropdown>
    </>
  );
};

export default Index;
