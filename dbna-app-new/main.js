//import all packages
const {app, BrowserWindow, webContents, session } = require("electron");
const path = require("path");
const url = require("url");
const opn = require('opn');
const json = require("jsonfile");

//read config
var config = json.readFileSync(__dirname+'\\config.json');
//set window variable
let win;

//create discord rpc
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
            
            var text = "Wartet...";
    
            if(match && match[0] && match[1]){
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
    
                }else{
                    text = "Liest etwas";
                }

                rpc.setActivity({
                    details: text,
                    startTimestamp,
                    largeImageKey: 'dbna_logo',
                    largeImageText: 'DBNA',
                    instance: false,
                });
            }
    
        },15000);

        rpc.setActivity({
            details: "Ist gerade online gegangen",
            startTimestamp,
            largeImageKey: 'dbna_logo',
            largeImageText: 'DBNA',
            instance: false,
        });

        win.webContents.executeJavaScript("console.log('[mainProcess] Discord RPC ready');");

    });

    rpc.login({ clientId: clientId }).catch(console.error);
}

//create window function
function createWindow(){
    win = new BrowserWindow({width:1240, height: 820,icon: 'favicon.ico', frame: false, webPreferences: {nodeIntegration: true, webviewTag: true}});

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
    pwin = new BrowserWindow({width:980, height: 750,icon: 'favicon.ico', frame: false, webPreferences: { nodeIntegration: true, webviewTag: true }});

    
    pwin.loadURL(__dirname+'\\app\\popup.html?url='+addr);
    
    pwin.setMenu(null);

    pwin.on('closes', () =>{
        win = null;
    });
}

//set app user model id for
app.setAppUserModelId(process.execPath);

//on ready create window and block ad requests
app.on('ready', () => {

    createWindow();

    //ad blocker
    session.defaultSession.webRequest.onBeforeRequest({urls: ['*://*./*']}, function(details, callback) {
            
        var test_url = details.url;
        var check_block_list =/\w+\.adnxs\.[a-z0-9]{1,3}|\w+\.dpd\.[a-z0-9]{1,3}|\w+\.adition\.[a-z0-9]{1,3}|\w+\.3lift\.[a-z0-9]{1,3}|\w+\.doubleclick\.[a-z0-9]{1,3}|\w+\.nativendo\.[a-z0-9]{1,3}|adservice\.google\.[a-z0-9]{1,3}/gi
        var block_me = check_block_list.test(test_url);
        if(block_me){
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
});

//disable warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';