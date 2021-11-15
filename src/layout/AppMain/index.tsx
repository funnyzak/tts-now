import { Tabs } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import SingleTTS from './Single';
import BatchTTS from './Batch';
import useAppSetting from '@/hook/appHook';

import './index.scss';

const PanelWrapper = styled.div`
  height: calc(100vh - 80px);
  padding-left: 37px;
  padding-right: 20px;
  background-color: #fff;
`;

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();

  const changeTagHandle = (actionMode: string) => {
    setAppSetting({
      customSetting: Object.assign(appSetting.customSetting, { actionMode })
    });
  };

  return (
    <div className="main-wrapper">
      <Tabs
        onChange={changeTagHandle}
        defaultActiveKey={appSetting.customSetting.actionMode}
        type="card"
        size="large"
      >
        <Tabs.TabPane tab="文字" key="SINGLE">
          <PanelWrapper>
            <SingleTTS />
          </PanelWrapper>
        </Tabs.TabPane>
        <Tabs.TabPane tab="批量" key="BATCH">
          <PanelWrapper>
            <BatchTTS />
          </PanelWrapper>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
