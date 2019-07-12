const {app, BrowserWindow, globalShortcut, webContents } = require("electron");
const path = require("path");
const url = require("url");
const opn = require('opn');
const json = require("jsonfile");
var config = json.readFileSync(__dirname+'\\config.json');

let win;
//rpc
if(config.rpc){
    const { Client } = require('discord-rpc');
    const clientId = '591707687121846292';
    
    const rpc = new Client({ transport: 'ipc' });
    
    rpc.on('ready', () => {
    
        const startTimestamp = new Date();

        setInterval(()=>{
    
            var title = win.getTitle();
            var regex = /DBNA - (.\w+)/gi;
            var match = regex.exec(title);
            
            var text = "";
    
            if(match[1] == "Start"){
                text = "Liest den Stream";
    
            }else if(match[1] == "Profil"){
                text = "Schaut sich Profile an";
    
            }else if(match[1] == "Fotos"){
                text = "Schaut sich Fotos an";
    
            }else if(match[1] == "Gruppen"){
                text = "Besucht eine Gruppe";
    
            }else if(match[1] == "Jungs"){
                text = "Sucht nach Jungs";
    
            }else if(match[1] == "Forum"){
                text = "Hält sich im Forum auf";

            }

            rpc.setActivity({
                details: text,
                startTimestamp,
                largeImageKey: 'dbna_logo',
                largeImageText: 'DBNA',
                instance: false,
            });
    
        },15000);

        rpc.setActivity({
            details: "Hat sich gerade eingeloggt",
            startTimestamp,
            largeImageKey: 'dbna_logo',
            largeImageText: 'DBNA',
            instance: false,
        });

    });

    rpc.login({ clientId: clientId }).catch(console.error);
}

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
    rpc.destroy();
});