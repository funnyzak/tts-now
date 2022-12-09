import { SettingOutlined } from '@ant-design/icons'
import { Affix, Button } from 'antd'
import { useState } from 'react'
import { SetttingDialog } from '../Dialog'
import AudioSet from './Audio'
import Avatar from './Avatar'
import Header from './Header'
import styles from './index.module.scss'

const Index = () => {
  const [btnBottom] = useState(0)
  const [showSetting, setShowSetting] = useState(false)
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
              setShowSetting(true)
            }}
          >
            配置
          </Button>
        </div>
      </Affix>
      {showSetting ? (
        <SetttingDialog
          closeCallBack={() => {
            setShowSetting(false)
          }}
        />
      ) : (
        <div />
      )}
    </div>
  )
}

export default Index
