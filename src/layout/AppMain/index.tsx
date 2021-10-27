import { Tabs } from 'antd';
import styled from 'styled-components';
import SingleTTS from './Single';
import BatchTTS from './Batch';

const { TabPane } = Tabs;

const Wrapper = styled.div`
  width: calc(100% - 280px);
  height: calc(100% - 28px);
  overflow: hidden;
  background-color: #f4f6fa;
  padding-top: 28px;
`;

const Index = () => {
  const callback = (data) => {
    console.log(data);
  };
  return (
    <Wrapper>
      <Tabs onChange={callback} type="card">
        <TabPane tab="单合成" key="1">
          <SingleTTS />
        </TabPane>
        <TabPane tab="批量合成" key="2">
          <BatchTTS />
        </TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default Index;
