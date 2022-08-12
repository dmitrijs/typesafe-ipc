import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { ipcMain } from './ipc';

app.on('ready', () => {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile(path.join((process.env.DIST_DIR || __dirname), 'window.html'));
  win.webContents.openDevTools({ mode: 'detach' });
});

/**
 * Parameters in the callback below are automatically typed!
 */
ipcMain.on('button-click', (event, payload) => {
  console.log(`received "button-click" via ipc (${payload.count})`);
  event.returnValue = 'button-click acknowledged!';
});
