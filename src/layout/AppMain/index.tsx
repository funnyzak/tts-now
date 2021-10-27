import SingleTTS from './Single'
import BatchTTS from './Batch'
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const Index = () => {
  const callback = (data) => {
    console.log(data)
  }
  return (
    <Tabs onChange={callback} type="card">
      <TabPane tab="单个" key="1">
        <SingleTTS />
      </TabPane>
      <TabPane tab="批量合成" key="2">
        <BatchTTS />
      </TabPane>
    </Tabs>
  )
};

export default Index
