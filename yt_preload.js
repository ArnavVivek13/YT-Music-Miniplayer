const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('mainAPI', {
    'forward-song-data': (data) => ipcRenderer.send('song-data', data),
});

function extract_player_state() {
    const root = document.querySelector('ytmusic-player-bar');
    if(!root) return null;
    else{
        return{
            title: root.querySelector('.title')?.innerText ?? null,
            artist: root.querySelector('.byline')?.innerText ?? null,
            time_info: root.querySelector('.time-info')?.innerText ?? null,
            cover: root.querySelector('img.image')?.src ?? null,
            playPause: root.querySelector('#play-pause-button > button')?.getAttribute('aria-label')?.toLowerCase().includes('pause') ?? false
        };
    }
}

function send_update() {
    const state = extract_player_state();
    if(state){
        console.log(state);
        ipcRenderer.send('forward-song-data', state);
    }
}

function wait_for_player() {
    const interval = setInterval(() => {
        const root = document.querySelector('ytmusic-player-bar');
        if(root){
            clearInterval(interval);
            console.log(extract_player_state());

            send_update();

            const observer = new MutationObserver(() => {
                send_update();
            });

            observer.observe(root, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }, 500);
}

ipcRenderer.on('control', (_, action) => {
    const previous = document.querySelector('.previous-button > button');
    const next = document.querySelector('.next-button > button');
    let playPause = document.querySelector('#play-pause-button > button');

    console.log('received control', action, { previous, next, playPause });

    switch (action) {
        case 'prev':
            if (previous) previous.click();
            break;
        case 'next':
            if (next) next.click();
            break;
        case 'pause':
            if (playPause) playPause.click();
            break;
    }
});

window.addEventListener('DOMContentLoaded', wait_for_player);