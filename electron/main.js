import { app as electronApp, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    electronApp.quit();
  });
}

if (!isDev) {
  import('../server/server.js').then((module) => {
    module.startServer().catch(err => {
      console.error('❌ Failed to start backend:', err.message);
    });
  }).catch(err => {
    console.error('❌ Failed to import backend:', err.message);
  });
}

electronApp.whenReady().then(() => {
  createWindow();

  electronApp.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit();
  }
});
