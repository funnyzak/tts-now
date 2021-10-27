import { app, protocol, BrowserWindow } from 'electron';

const config = require('../config');

let win: BrowserWindow;
const isDevelopment = process.env.NODE_ENV === 'development';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // https://www.electronjs.org/zh/docs/latest/api/browser-window
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    fullscreenable: false,
    maximizable: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (isDevelopment) {
    win.loadURL(
      `http://${config.devServiceConfig.host}:${config.devServiceConfig.port}`
    );
    win.resizable = true;
    win.webContents.openDevTools();
  } else {
    // Load the index.html when not in development
    win.loadURL(`file://${__dirname}/index.html`);
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
