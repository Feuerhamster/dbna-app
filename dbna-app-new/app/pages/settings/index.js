var cfgdata = jf.readFileSync(__dirname+"\\..\\config.json");
$("#input-popup").val(cfgdata.popup)
$("#input-general-notifications").attr("checked", cfgdata.msg.general);
$("#input-push-notifications").attr("checked", cfgdata.msg.push);
$("#input-chat-notifications").attr("checked", cfgdata.msg.chat);
$("#input-dark").attr("checked", cfgdata.darkMode);
$("#input-rpc").attr("checked", cfgdata.rpc);

$("#input-home").val(cfgdata.homepage);

if(cfgdata.password == false){
    $("#reset-pw-button").css("display", "none");
}

$("#input-password").change(function(event){
    
    var sha256 = require('js-sha256');
    var hash = sha256.create();
    hash.update(event.target.value);
    
    cfgdata.password = hash.hex();
    console.log(cfgdata.password);
    saveSettings(cfgdata);

    $("#lockbutton").css("display", "block");
    $("#reset-pw-button").css("display", "block");

});

$("#input-popup").change(function(event){
    cfgdata.popup = event.target.value;
    saveSettings(cfgdata);
});

$("#input-home").change(function(event){
    
    var regex = /https\:\/\/(www\.)?dbna\.com.+/gi;

    if(event.target.value.match(regex)){
        cfgdata.homepage = event.target.value;
        saveSettings(cfgdata);
    }else{
        alert('Die Startseite muss eine Seite auf DBNA sein!\nZum Beispiel "https://dbna.com/forum" oder "https://www.dbna.com/"');
    }
    

});


$("#input-general-notifications").change(function(event){
    cfgdata.msg.general = event.target.checked;
    saveSettings(cfgdata);
});
$("#input-push-notifications").change(function(event){
    cfgdata.msg.push = event.target.checked;
    saveSettings(cfgdata);
});
$("#input-chat-notifications").change(function(event){
    cfgdata.msg.chat = event.target.checked;
    saveSettings(cfgdata);
});

$("#input-dark").change(function(event){
    cfgdata.darkMode = event.target.checked;
    saveSettings(cfgdata);
});

$("#input-rpc").change(function(event){
    cfgdata.rpc = event.target.checked;
    saveSettings(cfgdata);
});


function saveSettings(newcfg){
    jf.writeFileSync(__dirname+"\\..\\config.json", newcfg, { spaces: 4 });
}

function resetPassword(){
    cfgdata.password = false;
    saveSettings(cfgdata);
    $("#lockbutton").css("display", "none");
    $("#reset-pw-button").html("Passwort gelöscht!");
    setTimeout(()=>{
        $("#reset-pw-button").css("display", "none");
    },2000);
}

function clearBrowserData(){
    win.webContents.session.clearCache(function(){
        console.log("[renderer] Session cache cleared");
    });
    win.webContents.session.clearStorageData(function(){
        console.log("[renderer] Storage data cleared");
    });
    $("#delete-browserdata-button").html("Browserdaten gelöscht!");
    setTimeout(()=>{
        $("#delete-browserdata-button").html("Browserdaten löschen");
    },2000);
}