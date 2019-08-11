//import modules
const {remote} =  require('electron');
const jf = require("jsonfile");
const ccopy = require("copy-to-clipboard");
const fs = require("fs");

var config = jf.readFileSync(__dirname+'\\..\\config.json');
var webviewelement = document.getElementById("webview");
var statsdata = {set:false};

//get this window
var win = remote.getCurrentWindow();

//listen for app shortcuts
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



//set window functions
var windowFunctions = {

    close:()=>{
        win.close()
    },

    minimize: ()=>{
        win.minimize()
    },

    maximize: ()=>{

        if(win.isMaximized() == false){
            win.maximize();
            document.getElementById("maximize_button").innerHTML = '<i class="far fa-window-restore"></i>';
        }else{
            win.unmaximize();
            document.getElementById("maximize_button").innerHTML = '<i class="far fa-square"></i>';
        }

    }

}

//set webview functions
var webviewFunctions = {
    
    reload: ()=>{
        webviewelement.reload()
    },

    openDevTools: ()=>{
        webviewelement.openDevTools()
    },

    back: ()=>{
        webviewelement.goBack()
    },

    forward: ()=>{
        webviewelement.goForward()
    },

    share: ()=>{

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
    },

    loadLink: (url)=>{
        webviewelement.loadURL(url);
    }

}

function loadSettingsPage(){

    if($("#app_content").html() == ""){

        $("#app_content").load(__dirname+"\\settings.html");
        $("#dbna_content").css("display", "none");
        $("#app_content").css("display", "block");

    }else{

        $("#dbna_content").css("display", "block");
        $("#app_content").css("display", "none");
        $("#app_content").html("");

    }

}


function loadStatsPage(){

    if($("#app_content").html() == ""){

        $("#app_content").load(__dirname+"\\stats.html");
        $("#dbna_content").css("display", "none");
        $("#app_content").css("display", "block");

    }else{

        $("#dbna_content").css("display", "block");
        $("#app_content").css("display", "none");
        $("#app_content").html("");

    }



}


function restore(){
    win.restore();
}

function showMenu(){
    
    if($("#dropwMenu").css("display") == "none"){

        $("#dropwMenu").css("display", "block");
        $("#dropwMenuButton").html('<i class="fas fa-ellipsis-h"></i>');

        var urlinput = document.getElementById("url-field");
        urlinput.focus();
        urlinput.select();

    }else{
        $("#dropwMenu").css("display", "none");
        $("#dropwMenuButton").html('<i class="fas fa-bars"></i>');
    }
}
function hideMenu(){
    if($("#dropwMenu").css("display") == "block"){
        showMenu();
    }
}

//check if user is logged in or not
$.ajax({
    type: 'GET',
    url: 'https://www.dbna.com/json/profile/me',
    data: "",
    success: function(data){

        $("#dbna_content").load(__dirname+"\\web.html");
        $("left-controls").css("display", "block");
        
        

    },
    error: function(xhr, options, thrownError){

        if(xhr.status == 401){

            $("#dbna_content").load(__dirname+"\\login.html");
            $("#left-controls").css("display", "none");

        }else{

            $("#dbna_content").load(__dirname+"\\con_error.html");
            $("#left-controls").css("display", "none");

        }

    }

});

if(config.password == false){
    $("#lockbutton").css("display", "none");
}

var URLfield = document.getElementById("url-field");

URLfield.addEventListener('keyup', function(event){
    event.preventDefault();

    if (event.keyCode === 13) {

        webviewFunctions.loadLink(URLfield.value);
        URLfield.value = "";
        showMenu();

    }
});