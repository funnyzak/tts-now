import { Tabs } from 'antd'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import SingleTTS from './Single'
import BatchTTS from './Batch'
import useAppSetting from '@/hook/app'

import './index.scss'

const PanelWrapper = styled.div`
  height: calc(100vh - 80px);
  padding-left: 37px;
  padding-right: 20px;
  background-color: #fff;
`

const Index = () => {
  const { appSetting, setAppSetting } = useAppSetting()

  const changeTagHandle = (actionMode: string) => {
    setAppSetting({
      customSetting: Object.assign(appSetting.customSetting, { actionMode })
    })
  }

  return (
    <div className="main-wrapper">
      <Tabs
        type="card"
        size="large"
        onChange={changeTagHandle}
        defaultActiveKey={appSetting.customSetting.actionMode}
        items={[
          {
            label: '文字',
            key: 'SINGLE',
            children: (
              <PanelWrapper>
                <SingleTTS />
              </PanelWrapper>
            )
          },
          {
            label: '批量',
            key: 'Batch',
            children: (
              <PanelWrapper>
                <BatchTTS />
              </PanelWrapper>
            )
          }
        ]}
      />
    </div>
  )
}

export default Index
