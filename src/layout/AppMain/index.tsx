import { Tabs } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import SingleTTS from './Single';
import BatchTTS from './Batch';
import useAppSetting from '@/hook/appHook';
import { AppSetting } from '@/config/define';

import './index.scss';

const { TabPane } = Tabs;

const Wrapper = styled.div`
  width: calc(100vw - 280px);
  height: 100vh;
  overflow: hidden;
  background-color: #f4f6fa;
  padding-top: 28px;
`;

const PanelWrapper = styled.div`
  height: calc(100vh - 80px);
  padding-left: 37px;
  padding-right: 20px;
  background-color: #fff;
`;
const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting();

  const changeTagHandle = (actionMode: string) => {
    setAppSetting({ actionMode });
  };

  return (
    <Wrapper>
      <Tabs
        onChange={changeTagHandle}
        defaultActiveKey={appSetting.actionMode}
        type="card"
        size="large"
      >
        <TabPane tab="文字" key="SINGLE">
          <PanelWrapper>
            <SingleTTS />
          </PanelWrapper>
        </TabPane>
        <TabPane tab="批量" key="BATCH">
          <PanelWrapper>
            <BatchTTS />
          </PanelWrapper>
        </TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default Index;
