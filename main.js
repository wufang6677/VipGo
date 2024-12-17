const {app, BrowserWindow} = require('electron')
const path = require('path')
const {autoUpdater} = require("electron-updater")

let port = 3300

//启动服务,访问下载的视频
require('./electron/server').init().then(re => {
    port = re;
}).catch(err => {
    console.log("err", err)
})

const createWindow = () => {
    const win = new BrowserWindow({
        title: 'VipGo',
        width: 1920,
        height: 1080,
        minWidth: 980,
        minHeight: 650,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'electron', 'preload.js')
        }
    })

    require('./electron/common.js').loadHtml(win)

    //win.webContents.openDevTools()

    app.commandLine.appendSwitch('lang', 'zh-CN');

    //初始化Event和Menu
    require('./electron/common.js').init(win, __dirname, port)
    return win
}
app.whenReady().then(() => {

    require('./electron/common.js').initCreateBeforeEvent(port)

    const win = createWindow()

    //  注册热键功能(createWindow后才能生效)
    require('./electron/common.js').initGlobalShortcut(win)
    require('./electron/common.js').initCreateAfterEvent(win)

    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口,点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    setTimeout(() => {
        autoUpdater.checkForUpdates().then(re => {
            console.log("checkForUpdates:", re)
        });
    }, 30000)
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
