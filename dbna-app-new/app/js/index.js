//import modules
const {remote} = require('electron');
const jf = require("jsonfile");
const ccopy = require("copy-to-clipboard");
const fs = require("fs");
const opn = require("opn");
const $ = require("jquery");
const customTitlebar = require('custom-electron-titlebar');

//init required variables
var config = jf.readFileSync(__dirname+'\\..\\config.json');
var statsdata = { set: false };
var webviewelement = null;

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


//check if user is logged in or not

$.ajax({
    type: 'GET',
    url: 'https://www.dbna.com/json/profile/me',
    data: "",
    success: function(data){
        pages.pages = {
            loader: true,
            dbna: false,
            login: false,
            stats: false,
            settings: false
        }
    },
    error: function(xhr, options, thrownError){

        if(xhr.status == 401){
            vueTitlebar.showLeftControls = false;
            pages.pages = {
                loader: false,
                dbna: false,
                login: true,
                stats: false,
                settings: false
            }
        }

    }

});

if(config.password == false){
    $("#lockbutton").css("display", "none");
}

//create titlebar
const titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#444')
});

//create empty window titlebar menu
const menu = new remote.Menu();

menu.append(new remote.MenuItem({
    label: ''
}));

titlebar.updateMenu(menu);

//append dropdown menu to titlebar
$(".menubar")[0].innerHTML = fs.readFileSync(__dirname + "\\dropdownMenuTemplate.html");

//load pages
$("#pages-dbna").html(fs.readFileSync(__dirname + "\\pages\\dbna\\index.html").toString());
$("#pages-settings").html(fs.readFileSync(__dirname + "\\pages\\settings\\index.html").toString());
$("#pages-stats").html(fs.readFileSync(__dirname + "\\pages\\stats\\index.html").toString());
$("#pages-login").html(fs.readFileSync(__dirname + "\\pages\\login\\index.html").toString());

$.getScript(__dirname + "\\pages\\dbna\\index.js");
$.getScript(__dirname + "\\pages\\settings\\index.js");
$.getScript(__dirname + "\\pages\\stats\\index.js");
$.getScript(__dirname + "\\pages\\login\\index.js");

//init checkboxes
$('label').each(function(){
  
    //get the current label element
    var $this = $(this);
    
    if($this.children('input[type="checkbox"]').length){
  
      //Check if is a switch or not
      if($this.children('input[type="checkbox"]').hasClass('switch')){
         $this.addClass('custom-checkbox-switch');
        $this.children('input[type="checkbox"]').after('<span class="custom-checkbox-switch-indicator"></span>');
      }else{
        $this.addClass('custom-checkbox');
        $this.children('input[type="checkbox"]').after('<span class="custom-checkbox-checkmark"></span>');
      }
      
    }
    
});