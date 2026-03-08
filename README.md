# YT Music Miniplayer

A lightweight **desktop overlay mini-player for YouTube Music** built with **Electron**.
The application embeds YouTube Music inside an Electron window and provides a **floating always-on-top mini player** that appears when the main window is minimized.

The mini player allows you to **control playback, view song metadata, and interact with the player without keeping the full window open**.

---

# Overview

This project creates a custom desktop experience for **YouTube Music** by combining:

* Electron's multi-window architecture
* Secure IPC communication
* DOM extraction of player metadata
* A floating overlay UI

The application consists of two main windows:

1. **Main Window**

   * Hosts the YouTube Music web app inside a `webview`.

2. **Overlay Miniplayer**

   * A small floating control panel that shows the current song and playback controls.

When the main window is minimized, the overlay appears.
Clicking the overlay restores the full player.

---

# Features

### Floating Overlay Player

* Always-on-top miniplayer
* Appears automatically when the main window is minimized
* Can be dragged across the screen

### Playback Controls

From the overlay you can control:

* Play / Pause
* Next Track
* Previous Track

These actions are forwarded to the YouTube Music web player via IPC.

---

### Live Song Metadata

The overlay displays:

* Song title
* Artist name
* Current playback time
* Album artwork

This information is extracted directly from the **YouTube Music DOM**.

---

### Dynamic Background

The overlay background dynamically adapts to the current song:

* Album cover is used as a blurred background
* CSS effects produce a gradient glass-like card

---

### Lightweight

* No heavy frameworks
* Built with **Vanilla JS + Electron**
* Small codebase and minimal dependencies

---

# UI Overview

## Main Player

The main window hosts YouTube Music.

It is a full desktop wrapper around:

```
https://music.youtube.com
```

This is embedded using an Electron `webview`.

---

## Overlay Miniplayer

The overlay displays:

```
┌─────────────────────────────┐
│ Song Title                  │
│ Artist           ◁  || ▷   │
│ 0:31 / 3:45                 │
└─────────────────────────────┘
```

Features:

* Always on top
* Frameless window
* Blurred album cover background
* Rounded card interface

---

# Architecture

The project uses a **multi-layer IPC architecture**:

```
Overlay UI
   ↓
overlay_preload.js
   ↓
Main Process (main.js)
   ↓
main_preload.js
   ↓
index.html
   ↓
YouTube Music webview
   ↓
yt_preload.js
```

Each layer communicates through **Electron IPC channels**.

---

# IPC Workflow

The application uses several IPC channels to allow communication between windows.

---

## 1. Song Data Flow

Purpose:
Send current track information from YouTube Music to the overlay.

Flow:

```
YouTube Music DOM
      ↓
yt_preload.js
      ↓
ipcRenderer.send("forward-song-data")
      ↓
main.js
      ↓
overlayWin.webContents.send("song-data")
      ↓
overlay_preload.js
      ↓
miniplayer.html
```

Result:

The overlay updates the UI with the latest song metadata.

---

## 2. Playback Controls

Purpose:
Allow the overlay to control the YouTube Music player.

Flow:

```
miniplayer.html
      ↓
overlay_preload.js
      ↓
ipcRenderer.send("playback-event")
      ↓
main.js
      ↓
mainWindow.webContents.send("playback-event")
      ↓
index.html
      ↓
webview.send("control")
      ↓
yt_preload.js
      ↓
DOM button click
```

Result:

The overlay buttons directly control the YouTube Music player.

---

# File Structure

```
Miniplayer
│
├── main.js
├── main_preload.js
├── index.html
│
├── yt_preload.js
│
├── miniplayer/
│   ├── miniplayer.html
│   ├── styles.css
│   ├── overlay_preload.js
│   └── images/
│
├── package.json
└── README.md
```

---

# File Explanations

## main.js

The **Electron main process**.

Responsibilities:

* Creates the main application window
* Creates the overlay window
* Handles IPC routing between windows
* Manages window lifecycle events

Key behaviors:

* Show overlay when minimized
* Close overlay when restored
* Forward IPC messages

---

## main_preload.js

Secure bridge between:

```
Main Renderer ↔ Main Process
```

Exposes safe APIs like:

* playback control listener

---

## index.html

The renderer page for the main window.

Contains the **YouTube Music webview**.

Responsibilities:

* Load YouTube Music
* Forward commands to the webview
* Receive playback commands from the overlay

---

## yt_preload.js

Injected into the YouTube Music webview.

Responsibilities:

* Extract player information from the DOM
* Detect playback state
* Trigger DOM events for playback controls
* Send song data back to the app

Example extracted data:

```
title
artist
current time
album artwork
play/pause state
```

---

## miniplayer/miniplayer.html

The overlay UI.

Displays:

* Song metadata
* Playback controls

Also handles UI events like:

```
prev
pause
next
```

---

## overlay_preload.js

Secure bridge for the overlay window.

Responsibilities:

Expose safe functions:

```
sendControl()
onSongData()
```

This prevents the renderer from directly accessing Node APIs.

---

## styles.css

Defines the miniplayer appearance.

Features:

* Dynamic blurred album cover background
* Dark translucent UI
* Responsive layout

---

# Installation

Clone the repository:

```bash
git clone https://github.com/ArnavVivek13/YT-Music-Miniplayer.git
cd YT-Music-Miniplayer
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

---

# Building the Executable

Create a Windows build:

```bash
npm run build:win
```

The executable will appear in the `dist` folder.

---

# Technologies Used

* Electron
* JavaScript
* HTML / CSS
* IPC (Inter-Process Communication)

---

# Disclaimer

This project is an **unofficial wrapper** for YouTube Music.

It is intended for educational and personal use.

---

# Future Improvements

Possible enhancements:

* Media key support
* System tray controls
* Volume integration
* Keyboard shortcuts
* Cross-platform builds

---

# Author

Arnav Vivek
