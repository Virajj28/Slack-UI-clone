const { app, BrowserWindow, webContents } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

   // Open the DevTools.
   mainWindow.webContents.openDevTools();

  let wc = mainWindow.webContents;
  wc.on("new-window", ()=>{
    console.warn('new window');
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.on('login', (event, webContents,details, authInfo, callback) => {
  event.preventDefault();
  createAuthPrompt().then(credentials => {
    callback(credentials.username, credentials.password);
  });

  function createAuthPrompt() {
    const authPromptWin = new BrowserWindow();
    authPromptWin.loadFile(path.join(__dirname, 'register.html'));

    return new Promise((resolve, reject) => {
      authPromptWin.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        if (newUrl.startsWith('http://localhost:3000/auth-callback')) {
          const query = newUrl.substr('http://localhost:3000/auth-callback'.length);
          const credentials = querystring.parse(query);
          authPromptWin.close();
          resolve(credentials);
        }
      });
    });
  }
});
