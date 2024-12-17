const {contextBridge, ipcRenderer} = require('electron/renderer')

contextBridge.exposeInMainWorld('electronApi', {
    setFullScreen: (isFullScreen, url) => ipcRenderer.send('set-full-screen', isFullScreen, url),
    openExternal: (url) => ipcRenderer.send('open-external', url),
    addDownloadTask: (data) => ipcRenderer.send('add-download-task', data),
    pauseDownloadTask: (data) => ipcRenderer.send('pause-download-task', data),
    onUpdateList: (callback) => ipcRenderer.on('update-list', (_event, data) => callback(data)),
    openWebPage: (callback) => ipcRenderer.on('open-web-page', (_event, data) => callback(data)),
    onUpdateDownloadProgress: (callback) => ipcRenderer.on('on-update-download-progress', (_event, data) => callback(data)),
    getPort: () => ipcRenderer.invoke('getPort')
})
