const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
    sendControl: (action) => ipcRenderer.send('playback-event', action),
    onSongData: (callback) => ipcRenderer.on('song-data', (_, data) => callback(data)),
});