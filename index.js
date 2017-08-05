const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add',
  });
  if(process.env.NODE_ENV !== 'development')
    addWindow.setMenu(null);
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null);
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Todo',
        accelerator: 'CommandOrControl+N',
        click: createAddWindow
      },
      {
        label: 'Clear Todos',
        click() {
          mainWindow.webContents.send('todos:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

// iOS Menu Fix
if(process.platform === 'darwin') {
  menuTemplate.unshift({});
}
// Development tools
if(process.env.NODE_ENV === 'development') {
  menuTemplate.push({
    label: 'Development',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' }
    ]
  });
}
