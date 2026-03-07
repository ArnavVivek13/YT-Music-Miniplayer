const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('mainAPI', {
    'onControl': (callback) => ipcRenderer.on('playback-event', (_, action) => callback(action)),
});