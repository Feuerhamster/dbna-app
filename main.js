const {app, BrowserWindow, globalShortcut} = require("electron");
const path = require("path");
const url = require("url");
const opn = require('opn');
const { webContents } = require('electron');
const json = require("jsonfile");
var config = json.readFileSync(__dirname+'\\config.json');


let win;

function createWindow(){
    win = new BrowserWindow({width:1240, height: 820,icon: config.app_icon, frame: false, webPreferences: { webSecurity: false }});

    if(config.password){
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/security.html'),
            protocol: 'file',
            slashes: true
        }));
    }else{
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/index.html'),
            protocol: 'file',
            slashes: true
        }));
    }
    

    win.setMenu(null);

    win.on('closes', () =>{
        win = null;
    });
}

function createPopupWindow(addr){
    pwin = new BrowserWindow({width:920, height: 750,icon: config.app_icon, frame: false, webPreferences: { webSecurity: false }});

    
    pwin.loadURL(__dirname+'\\app\\popup.html?url='+addr);
    
    pwin.setMenu(null);

    pwin.on('closes', () =>{
        win = null;
    });
}

app.setAppUserModelId(process.execPath);

app.on('ready', () => {

    createWindow();

    globalShortcut.register('CommandOrControl+d+i', () => {
        win.openDevTools();
    });
    globalShortcut.register('CommandOrControl+d+r', () => {
        win.reload();
    });
    globalShortcut.register('CommandOrControl+l', () => {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/security.html'),
            protocol: 'file',
            slashes: true
        }));
    });


})

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {

    // Check for a webview
    if (contents.getType() == 'webview') {
  
      // Listen for any new window events
      contents.on('new-window', (e, url) => {
        e.preventDefault()
        if(config.windowSettings == "popup"){
            createPopupWindow(url);
        }else{
            opn(url);
        }
        
      })
    }
  })

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});


app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  });