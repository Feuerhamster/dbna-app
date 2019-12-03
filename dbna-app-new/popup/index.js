//import modules
const {remote, ipcRenderer} = require('electron');
const opn = require("opn");
const customTitlebar = require('custom-electron-titlebar');
const $ = require("jquery");

//get this window
var win = remote.getCurrentWindow();

//listen for app shortcuts
document.addEventListener("keydown", function(event){

    if(event.keyCode == 73 && event.shiftKey && event.ctrlKey){

        win.toggleDevTools();

    }else if(event.keyCode == 82 && event.shiftKey && event.ctrlKey){

        win.reload();

    }

});

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

$(".menubar")[0].innerHTML = `
<div id="titlebar-left-controls">

    <button class="ui-btn" v-on:click="webviewBack" title="Seite zurück">
        <i class="fas fa-arrow-left"></i>
    </button>
    <button class="ui-btn" v-on:click="webviewForward" title="Seite vor">
        <i class="fas fa-arrow-right"></i>
    </button>

    <button class="ui-btn" v-on:click="webviewReload" title="Neu laden">
        <i class="fas fa-sync"></i>
    </button>

    <button class="ui-btn" v-on:click="openInBrowser" title="Im Browser öffnen">
    <i class="fas fa-external-link-alt"></i>
    </button>

</div>
`;

var vueTitlebar = null;
var urlField = null;

var webviewelement = document.getElementById("popup-webview");
var requestedURL = decodeURIComponent(window.location.search.split("url=")[1]);
webviewelement.src = requestedURL;

webviewelement.addEventListener("did-navigate-in-page", (e)=>{
    console.log(e);
    urlField.urlValue = e.url;
});

var vueTitlebar = new Vue({
    el: "#titlebar-left-controls",
    methods:{
        webviewBack: function(){
            webviewelement.goBack();
        },
        webviewForward: function(){
            webviewelement.goForward();
        },
        webviewReload: function(){
            webviewelement.reload();
        },
        openInBrowser: function(){
            opn(webviewelement.getURL());
        }
    }
});

var urlField = new Vue({
    el: "#url-field-wrapper",
    data: {
        urlValue: requestedURL
    },
    methods: {
        loadLink: function(event){
            webviewelement.loadURL(event.target.value);
        }
    }
});