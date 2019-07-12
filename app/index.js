const {remote} =  require('electron');
const json = require("jsonfile");
const ccopy = require("copy-to-clipboard");
var config = json.readFileSync(__dirname+'\\..\\config.json');
var webviewelement = document.getElementById("webview");
var statsdata = {set:false};

var win = remote.getCurrentWindow();

document.addEventListener("keydown", function(event){
    if(event.keyCode == 73 && event.shiftKey && event.ctrlKey){
        win.toggleDevTools();
    }else if(event.keyCode == 82 && event.shiftKey && event.ctrlKey){
        win.reload();
    }else if(event.keyCode == 122){
        if(config.fullscreen){
            config.fullscreen = false;
        }else{
            config.fullscreen = true;
        }
        win.setFullScreen(config.fullscreen);
    }
});


function windowClose(){
    win.close();
}
function windowMinimize(){
    win.minimize();
}

function windowMaximize(){

    if(win.isMaximized() == false){
        win.maximize();
        document.getElementById("maximize_button").innerHTML = '<i class="far fa-window-restore"></i>';
    }else{
        win.unmaximize();
        document.getElementById("maximize_button").innerHTML = '<i class="far fa-square"></i>';
    }
}

function webviewReload(){
    webviewelement.reload();
}

function webviewDevTools(){
    webviewelement.openDevTools();
}
function webviewBack(){
    webviewelement.goBack();
}
function webviewForward(){
    webviewelement.goForward();
}
function webviewShare(){
       var shareUrl = webviewelement.getURL();
       ccopy(shareUrl);
       var shareBtn = document.getElementById('share-btn');
       if(shareBtn.tagName == "LI"){

            shareBtn.classList.toggle("active-menu-btn");
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Kopiert!';
            setTimeout(()=>{
                shareBtn.classList.toggle("active-menu-btn");
                shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Link kopieren';
            },1000);

       }else{

            shareBtn.classList.toggle("active-menu-btn");
            setTimeout(()=>{
                shareBtn.classList.toggle("active-menu-btn");
            },1000);

       }
       
}

var seswitch = false;
function settings(){

    if(!seswitch){
        $("#app_content").load(__dirname+"\\settings.html");
        document.getElementById("dbna_content").style.display = "none";
        document.getElementById("app_content").style.display = "block";
        seswitch = true;
    }else{

        document.getElementById("dbna_content").style.display = "block";
        document.getElementById("app_content").style.display = "none";
        document.getElementById("app_content").innerHTML = "";
        seswitch = false;
    }



}

var stswitch = false;
function stats(){

    if(!stswitch){
        $("#app_content").load(__dirname+"\\stats.html");
        document.getElementById("dbna_content").style.display = "none";
        document.getElementById("app_content").style.display = "block";
        stswitch = true;
    }else{

        document.getElementById("dbna_content").style.display = "block";
        document.getElementById("app_content").style.display = "none";
        document.getElementById("app_content").innerHTML = "";
        stswitch = false;
    }



}


function restore(){
    win.restore();
}


var dropMenu = false;
function showMenu(){
    
    if(dropMenu == false){
        document.getElementById("dropwMenu").style.display="block";
        document.getElementById("dropwMenuButton").innerHTML='<i class="fas fa-ellipsis-h"></i>';
        dropMenu = true;
        var urlinput = document.getElementById("url-field");
        urlinput.focus();
        urlinput.select();
    }else{
        document.getElementById("dropwMenu").style.display="none";
        document.getElementById("dropwMenuButton").innerHTML='<i class="fas fa-bars"></i>';
        dropMenu = false;
    }
}
function hideMenu(){
    if(dropMenu){
        showMenu();
    }
}

function loadLink(url){
    webviewelement.loadURL(url);
}