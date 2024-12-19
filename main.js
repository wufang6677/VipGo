const {app, BrowserWindow} = require('electron')
const path = require('path')
const {autoUpdater} = require("electron-updater")
const common = require('./electron/common.js')

let port = 3300

//启动服务,访问下载的视频
require('./electron/server').init().then(re => {
    port = re;
}).catch(err => {
    console.log("err", err)
})
let windowState = common.appInfo();

const createWindow = () => {
    const win = new BrowserWindow({
        title: 'VipGo',
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        minWidth: 980,
        minHeight: 650,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'electron', 'preload.js')
        }
    })

    win.on('close', () => {
        windowState.saveWindowState(win);
    });

    common.loadHtml(win)

    //win.webContents.openDevTools()

    app.commandLine.appendSwitch('lang', 'zh-CN');

    //初始化Event和Menu
    common.init(win, __dirname, port)
    return win
}
app.whenReady().then(() => {
    //注册createWindow前Event
    common.initCreateBeforeEvent(port)

    const win = createWindow()

    //  注册热键功能(createWindow后才能生效)
    common.initGlobalShortcut(win)
    // 注册createWindow后Event
    common.initCreateAfterEvent(win)

    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口,点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    //检测更新
    autoUpdater.checkForUpdates().then();
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
