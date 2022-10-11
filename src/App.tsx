import { useState, useEffect, useMemo } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import Index from './layout'
import {
  AppContext, appSetting, appSettingCacheKey, store
} from '@/config'
import { appReset } from '@/utils/core'

appReset()

export default function () {
  const [setting, setSetting] = useState(appSetting)

  const updateConfig = (newSetting: {
    [T in keyof APP.AppSetting]?: APP.AppSetting[T]
  }) => {
    setSetting({ ...setting, ...newSetting })
  }

  useEffect(() => {
    store.set(appSettingCacheKey, setting)
  }, [setting])

  const appConextValue = useMemo(
    () => ({
      appSetting: setting,
      setAppSetting: updateConfig
    }),
    [setting, updateConfig]
  )

  return (
    <ConfigProvider direction="ltr" locale={zhCN}>
      <AppContext.Provider value={appConextValue}>
        <Index />
      </AppContext.Provider>
    </ConfigProvider>
  )
}
