const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('node:path');

let win;
let overlayWin;
let latestSongData = null;
let overlayPosition;

function createWindow() {
    const screenDims = screen.getPrimaryDisplay();
    const { width, height } = screenDims.workAreaSize;

    win = new BrowserWindow({
        width: width,
        height: height,
        center: true,
        autoHideMenuBar: true,
        webPreferences: {
            partition: 'persist:ytmusic',
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, 'main_preload.js')
        }
    });

    win.loadFile('index.html');

    win.webContents.on('did-fail-load', (e, code, desc) => {
        console.log('Load failed:', code, desc);
    });

    win.on('minimize', createOverlayWindow);

    win.on('restore', () => {
        if (overlayWin && !overlayWin.isDestroyed()) {
            overlayWin.close();
        }
    });

    win.on('closed', () => {
        overlayWin = null;
    });
}

function createOverlayWindow() {

    if (overlayWin && !overlayWin.isDestroyed()) return;

    const screenDims = screen.getPrimaryDisplay();
    const { width, height } = screenDims.workAreaSize;

    overlayWin = new BrowserWindow({
        width: Math.round(width * 0.2),
        height: Math.round(height * 0.085),

        x: overlayPosition ? overlayPosition[0] : undefined,
        y: overlayPosition ? overlayPosition[1] : undefined,

        frame: false,
        alwaysOnTop: true,
        focusable: false,
        skipTaskbar: true,
        hasShadow: false,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'miniplayer/overlay_preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    overlayWin.setAlwaysOnTop(true, 'screen-saver');

    overlayWin.on('blur', () => {
        overlayWin.setAlwaysOnTop(true, 'screen-saver');
    });

    overlayWin.loadFile('miniplayer/miniplayer.html');

    overlayWin.once('ready-to-show', () => {
        if (!overlayWin || overlayWin.isDestroyed()) return;

        overlayWin.webContents.send('song-data', latestSongData);
        overlayWin.show();
    });

    overlayWin.on("close", () => {
        overlayPosition = overlayWin.getPosition();
    });

    overlayWin.on('closed', () => {
        overlayWin = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('forward-song-data', (event, data) => {
        latestSongData = data;

        if (overlayWin && !overlayWin.isDestroyed()) {
            overlayWin.webContents.send('song-data', data);
        }
    });

    ipcMain.on('playback-event', (event, data) => {
        win.webContents.send('playback-event', data);
    });
});

app.on('window-all-closed', () => {
    app.quit();
});