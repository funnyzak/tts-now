import { app, protocol, BrowserWindow } from 'electron';

const config = require('../app.config');

let win: BrowserWindow;

const isDevelopment = process.env.NODE_ENV === 'development';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

/**
 * 禁止刷新和调试
 */
function stopKey(_win: BrowserWindow) {
  const KEY_BLACK_LIST = ['I', 'R'];
  const FKEY_BLACK_LIST = ['F5', 'F12'];
  _win.webContents.on('before-input-event', (event, input) => {
    console.log('before-input-event', input);
    // input.control 为windows CTRL；input.meta 为mac Ctrl键
    // 以下条件为禁止组合键和F键 刷新和调试
    if (
      ((input.control || input.meta)
        && KEY_BLACK_LIST.includes(input.key.toUpperCase()))
      || FKEY_BLACK_LIST.includes(input.key.toUpperCase())
    ) {
      event.preventDefault();
    }
  });
}

function createWindow() {
  // https://www.electronjs.org/zh/docs/latest/api/browser-window
  win = new BrowserWindow({
    show: isDevelopment,
    width: 1024,
    height: 750,
    minHeight: 750,
    minWidth: 1024,
    fullscreenable: isDevelopment,
    maximizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 禁止页面不可见时停止计时器。防止setTimeout问题
  win.webContents.setBackgroundThrottling(false);

  if (isDevelopment) {
    win.loadURL(`http://${config.devServer.host}:${config.devServer.port}`);
    win.resizable = true;
    win.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`);

    stopKey(win);

    win.on('ready-to-show', () => {
      win.show();
    });
  }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
