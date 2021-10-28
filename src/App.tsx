import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import Index from './layout';
import { AppSetting } from '@/config/define';
import { AppContext, appSetting, appSettingCacheKey } from '@/config';

export default () => {
  const [setting, setSetting] = useState(appSetting);

  const updateConfig = (newSetting: {
    [T in keyof AppSetting]?: AppSetting[T];
  }) => {
    console.log(newSetting);
    setSetting({ ...setting, ...newSetting });
  };

  useEffect(() => {
    localStorage.setItem(appSettingCacheKey, JSON.stringify(setting));
  }, [setting]);

  return (
    <ConfigProvider direction="ltr">
      <AppContext.Provider
        value={{ appSetting: setting, setAppSetting: updateConfig }}
      >
        <Index />
      </AppContext.Provider>
    </ConfigProvider>
  );
};
