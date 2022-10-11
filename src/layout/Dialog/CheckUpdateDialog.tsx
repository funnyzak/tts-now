import React, { useState } from 'react'
import { Modal } from 'antd'
import { ipcRenderer } from 'electron'
import * as core from '@/utils/core'
import { compareVersion } from '@/utils'
import packageInfo from '../../../package.json'

const releaseApiUrl = 'https://api.github.com/repos/funnyzak/tts-now/releases/latest'
const RP = require('request-promise')

async function requestRelease() {
  try {
    return await RP({
      uri: releaseApiUrl,
      headers: {
        'User-Agent': 'hello world'
      },
      json: true
    })
  } catch (e) {
    core.logger(`requestRelease error: ${e}`, e.stack)
    return null
  }
}

const Index: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState<boolean>(false)
  const [oldVersion] = useState<string>(packageInfo.version)
  const [newVersion, setNewVersion] = useState<String>('0.0.0')
  const [downloadUrl, setDownloadUrl] = useState<string>(
    'https://github.com/funnyzak/tts-now/releases/latest'
  )
  const [changelog, setChangelog] = useState<String>('细节优化，BUG修复')

  const [init, setInit] = useState<boolean>(false)

  const okHandler = () => {
    ipcRenderer.send('open-external', downloadUrl)
  }

  if (!init) {
    setInit(true)
    requestRelease().then((releaseInfo) => {
      if (releaseInfo !== null) {
        setNewVersion(releaseInfo.tag_name)
        setChangelog(releaseInfo.body)
        setDownloadUrl(releaseInfo.html_url)
        setShowUpdate(compareVersion(releaseInfo.tag_name, oldVersion) > 0)
      }
    })
  }

  return (
    <Modal
      title="有新版本了"
      centered
      okText="更新"
      cancelText="暂不更新"
      maskClosable={false}
      closable={false}
      open={showUpdate}
      onOk={okHandler}
      onCancel={() => setShowUpdate(false)}
      width={350}
    >
      <p>
        检查到新版本
        {' '}
        {newVersion}
        ，当前版本
        {' '}
        {oldVersion}
        ，请及时更新。安装新版本前请先卸载旧版本！
      </p>

      <p>
        更新内容：
        {changelog}
      </p>
    </Modal>
  )
}

export default Index
