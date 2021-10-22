const { app, BrowserWindow, webContents } = require('electron');
const path = require('path');
const net = require('net');
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

// Register to the app
const askregister = document.querySelector('#btnRegister');

// Handle the register event
askregister.addEventListener('click', () => {
  // const response = await fetch('http://localhost:3000/api/user/register', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     "Accept": "application/json"
  //   },
  //   body: JSON.stringify({
  //     email: document.querySelector('#email').value
  //   })
  // });
  // const data = await response.json();
  // console.log(data);

  const request = net.request({
    method: 'POST',
    url: 'http://localhost:3000/api/user/register',
    path: '/api/user/register',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      "Accept": "application/json"
    },
    body: JSON.stringify({
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value
    })
  });
});



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
  callback('email', 'password');
});
