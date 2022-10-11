import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  Menu,
  dialog,
  shell
} from 'electron'

const Store = require('electron-store')

const PackgeInfo = require('../package.json')

const config = require('../app.config')

let win: BrowserWindow

const isDevelopment = process.env.NODE_ENV === 'development'
const isMac = process.platform === 'darwin'

Store.initRenderer()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/**
 * 禁止刷新和调试
 */
function stopKey(_win: BrowserWindow) {
  const KEY_BLACK_LIST = ['I', 'R']
  const FKEY_BLACK_LIST = ['F5', 'F12']
  _win.webContents.on('before-input-event', (event, input) => {
    console.log('before-input-event', input)
    // input.control 为windows CTRL；input.meta 为mac Ctrl键
    // 以下条件为禁止组合键和F键 刷新和调试
    if (
      ((input.control || input.meta)
        && KEY_BLACK_LIST.includes(input.key.toUpperCase()))
      || FKEY_BLACK_LIST.includes(input.key.toUpperCase())
    ) {
      event.preventDefault()
    }
  })
}

function registerLocalResourceProtocol() {
  protocol.registerFileProtocol('local-resource', (request, callback): void => {
    const url = request.url.replace(/^local-resource:\/\//, '')
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
    try {
      callback(decodedUrl)
    } catch (error) {
      console.error(
        'ERROR: registerLocalResourceProtocol: Could not get file path:',
        error
      )
    }
  })
}

function createWindow() {
  // https://www.electronjs.org/zh/docs/latest/api/browser-window
  win = new BrowserWindow({
    title: PackgeInfo.name,
    show: isDevelopment,
    width: 1024,
    height: 745,
    minHeight: 745,
    minWidth: 1024,
    fullscreenable: isDevelopment,
    maximizable: true,
    movable: true,
    titleBarStyle: 'hiddenInset', // 无边框
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration:
        (process.env.ELECTRON_NODE_INTEGRATION || 'true').toUpperCase()
        === 'TRUE',
      contextIsolation: false,
      webSecurity: false
    }
  })

  // 禁止页面不可见时停止计时器。防止setTimeout问题
  win.webContents.setBackgroundThrottling(false)

  if (isDevelopment) {
    win.loadURL(`http://${config.devServer.host}:${config.devServer.port}`)
    win.resizable = true
    win.webContents.openDevTools()
  } else {
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`)

    stopKey(win)

    win.on('ready-to-show', () => {
      win.show()
    })
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow()

  // 注册自定义协议
  registerLocalResourceProtocol()

  console.log('app temp path:', app.getPath('temp'))

  // 选择要转换的文件或其他选择
  ipcMain.on('select_files', (event, arg) => {
    console.log(event, arg)

    // https://www.electronjs.org/docs/latest/api/dialog
    dialog
      .showOpenDialog(win, {
        title: '选择文件',
        buttonLabel: '确定',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: '文件', extensions: ['txt', 'text'] }],
        ...(arg.config || {})
      })
      .then((_rlt) => {
        console.log(_rlt)
        event.reply('selected_files', {
          data: _rlt,
          action: arg.action
        })
      })
  })

  ipcMain.on('open-external', (_event, arg) => {
    shell.openExternal(arg)
  })

  ipcMain.on('getpath', (_event, arg) => {
    console.log(_event, arg)
    _event.reply('getpath', {
      path: app.getPath(
        arg.pathName as
          | 'home'
          | 'appData'
          | 'userData'
          | 'sessionData'
          | 'temp'
          | 'exe'
          | 'module'
          | 'desktop'
          | 'documents'
          | 'downloads'
          | 'music'
          | 'pictures'
          | 'videos'
          | 'recent'
          | 'logs'
          | 'crashDumps'
      ),
      arg
    })
  })

  ipcMain.on('open-close-dialog', (_event, _arg) => {
    dialog
      .showMessageBox(win, {
        type: 'info',
        title: '提示',
        message: '是否关闭应用程序？',
        buttons: ['取消', '关闭']
      })
      .then((res) => {
        if (res.response === 1) {
          app.exit()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  })
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

const menuTemplate: any = [
  ...(isMac
    ? [
      {
        label: app.name,
        submenu: [
          { role: 'about', label: '关于' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide', label: '隐藏' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit', label: '退出' }
        ]
      }
    ]
    : [
      {
        label: config.appName,
        submenu: [
          {
            label: '退出',
            click: () => {
              app.quit()
            }
          }
        ]
      }
    ]),
  {
    label: '编辑',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
          }
        ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ]
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: 'SSML标记语言',
        click: async () => {
          await shell.openExternal(
            'https://help.aliyun.com/document_detail/101645.html'
          )
        }
      },
      {
        label: '帮助',
        click: async () => {
          await shell.openExternal('https://funnyzak.github.io/tts-now')
        }
      },
      {
        label: '检查更新',
        click: async () => {
          await shell.openExternal(
            'https://github.com/funnyzak/tts-now/releases/latest'
          )
        }
      }
    ]
  }
]
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
