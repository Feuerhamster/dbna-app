//import all packages
const {app, BrowserWindow, webContents, session, Tray, Menu, Notification, nativeImage, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const opn = require('opn');
const json = require("jsonfile");

//read config
var config = json.readFileSync(__dirname+'\\config.json');

//set window variable
let win;
let tray = null;

//create window function
function createWindow(){
    win = new BrowserWindow({width:1240, height: 820, icon: 'favicon.ico', backgroundColor: '#ccc', frame: false, webPreferences: {nodeIntegration: true, webviewTag: true}});

    if(config.password){
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'app/locked.html'),
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
    pwin = new BrowserWindow({width: 1000, height: 720,icon: 'favicon.ico', backgroundColor: "#11b6e9", frame: false, webPreferences: { nodeIntegration: true, webviewTag: true }});

    
    pwin.loadURL(__dirname+'\\popup\\index.html?url=' + encodeURIComponent(addr));
    
    pwin.setMenu(null);

    pwin.on('closes', () =>{
        win = null;
    });
}


ipcMain.on('dbna-successful-login', (event, args) => {
    if(args){
        session.defaultSession.cookies.get({}, (error, cookies) => {
            var cdsess = cookies.find(value => value.name == "cdsess");
            console.log(cdsess.value);
        });
    }
});


//set app user model id for
app.setAppUserModelId(process.execPath);

//on ready create window and block ad requests
app.on('ready', () => {

    createWindow();

    var icon = nativeImage.createFromPath(__dirname + "\\trayicon.png");
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Beenden', type: 'normal', click: ()=>{ app.quit(); } },
    ]);
    tray.setToolTip('DBNA');
    tray.setContextMenu(contextMenu);

    //ad blocker
    session.defaultSession.webRequest.onBeforeRequest({urls: ['*://*./*']}, function(details, callback) {
        
        var blockList =/\w+\.adnxs\.[a-z0-9]{1,3}|\w+\.dpd\.[a-z0-9]{1,3}|\w+\.adition\.[a-z0-9]{1,3}|\w+\.3lift\.[a-z0-9]{1,3}|\w+\.doubleclick\.[a-z0-9]{1,3}|\w+\.nativendo\.[a-z0-9]{1,3}|adservice\.google\.[a-z0-9]{1,3}|\w+\.smartadserver\.[a-z0-9]{1,3}|\w+\.amazon-adsystem\.[a-z0-9]{1,3}|\w+\.yieldlab\.[a-z0-9]{1,3}|\w+\.adtech\.[a-z0-9]{1,3}|\w+\.advertising\.[a-z0-9]{1,3}|\w+\.mookie1\.[a-z0-9]{1,3}/gi
        var res = blockList.test(details.url);

        if(res){
            callback({cancel: true});

        }else{
            callback({cancel: false})
        }

    });

})

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {
    // Check for a webview
    if (contents.getType() == 'webview') {
  
        // Listen for any new window events
        contents.on('new-window', (e, url) => {

            e.preventDefault();

            if(config.popup == "customWindow"){
                createPopupWindow(url);
            }else{
                opn(url);
            }
        });

    }
});

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

//destroy RPC on app quit
app.on('will-quit', () => {
    if(rpc){
        rpc.destroy();
    }
    if(tray){
        tray.destroy();
    }
});

//disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';