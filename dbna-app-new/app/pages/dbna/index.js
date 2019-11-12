var webviewelement = document.getElementById("dbna-webview");
webviewelement.src = config.homepage;

webviewelement.addEventListener('did-finish-load', (e) => {

    webviewelement.insertCSS(fs.readFileSync(__dirname + "\\css\\webview\\dbna.css").toString());

    if(config.darkMode){
        webviewelement.insertCSS(fs.readFileSync(__dirname + "\\css\\webview\\dark.css").toString());
    }

    if(!e.target.src.split("/")[3].startsWith("?loggedOut") && e.target.src.split("/")[3]){
        setTimeout(()=>{
            pages.pages.dbna = true;
            pages.pages.loader = false;
            pages.pages.login = false;
            vueTitlebar.showLeftControls = true;
        },500); 
    }
    
    
});
webviewelement.addEventListener('did-navigate-in-page', (e) => {

    var win = remote.getCurrentWindow();
    var currentURL = e.url;

    var splitted = currentURL.split("/");

    if(splitted[3] == "start"){
        setTimeout(function(){
            win.setTitle("DBNA - Start");
        }, 500);
    }
    if(splitted[3] == "profile"){

        if(splitted[5] == "text"){
            setTimeout(function(){
                win.setTitle("DBNA - Profil > Fragebögen");
            }, 500);
        }else if(splitted[5] == "photos"){
            setTimeout(function(){
                win.setTitle("DBNA - Profil > Fotos");
            }, 500);
        }else if(splitted[5] == "friends"){
            setTimeout(function(){
                win.setTitle("DBNA - Profil > Freunde");
            }, 500);
        }else if(splitted[5] == "groups"){
            setTimeout(function(){
                win.setTitle("DBNA - Profil > Gruppen");
            }, 500);
        }else{
            setTimeout(function(){
                win.setTitle("DBNA - Profil");
            }, 500);
        }
    }
    if(splitted[3] == "groups"){
        setTimeout(function(){
            win.setTitle("DBNA - Gruppen");
        }, 500);
    }
    if(splitted[3] == "photos"){
        setTimeout(function(){
            win.setTitle("DBNA - Fotos");
        }, 500);
    }
    if(splitted[3] == "guys"){
        setTimeout(function(){
            win.setTitle("DBNA - Jungs");
        }, 500);
    }
    if(splitted[3] == "forum"){
        if(splitted[6]){
            setTimeout(function(){
                win.setTitle("DBNA - Forum > "+splitted[6]);
            }, 500);
        }else{
            setTimeout(function(){
                win.setTitle("DBNA - Forum");
            }, 500);
        }

    }

    if(splitted[3].startsWith("?loggedOut") || !splitted[3]){
        pages.pages.dbna = false;
        pages.pages.loader = false;
        pages.pages.login = true;
    }else{
        pages.pages.dbna = true;
        pages.pages.loader = false;
        pages.pages.login = false;
        vueTitlebar.showLeftControls = true;
    }


});