//url to the websocket server of dbna
var wsurl = "wss://www.dbna.com/chat-server/socket.io/?EIO=3&transport=websocket";
//set variable with ping interval
var pinginterval = 0;

//create wsconnection function
function wsconnection(){
    //create ping function
    var csPing = ()=>{
        setTimeout(()=>{
            ws.send("2");
        },pinginterval);
    }
    //create websocket object
    var ws = new WebSocket(wsurl);

    //listen to websocket errors
    ws.onerror = function(){
        //show error in ui
        $("#dbna_content").load(__dirname+"\\con_error.html");
        document.getElementById("left-controls").style.display = "none";
        console.log("[ws] connection error");
    }
    
    ws.onopen = function() {
    
        console.log("[ws] connected to dbna chatserver");
        
    };
    
    ws.onmessage = function(get){
        //get data
        var data = get.data.toString();
    
        if(data.substring(0,1) == "0"){
            var inc = JSON.parse(data.substring(1));
            pinginterval = inc.pingInterval;
            csPing();
        }
    
        if(data == "3"){
            csPing();
        }
    
        if(data.substring(0,2) == "42"){
            var inc = JSON.parse(data.substring(2));
    
            if(inc[0] == "notify" && inc[1].type != "status" && inc[1].type != "req_delete" && inc[1].type != "not_delete" && inc[1].type != "not_delete_all" && config.msg.push == true){
    
                if(inc[1].not){
                    
                    if(inc[1].not.type == "user:story"){
                        var ntbody = inc[1].not.user.username+' kommentierte etwas 🗨';
                    }else if(inc[1].not.type == "heart"){
                        var ntbody = inc[1].not.user.username+' gefällt etwas von dir ❤';
                    }else if(inc[1].not.type == "crush"){
                        var ntbody = inc[1].not.user.username+' hat dir einen Crush geschicht 💌';
                    }else if(inc[1].not.type == "forum"){
                        var ntbody = 'Etwas hat sich im Forum getan 📃';
                    }else{
                        ntbody = "";
                    }
    
                }else{
                    ntbody = "";
                    if(inc[1].type == "req"){
                        ntbody = "Freundschaftsanfrage von "+inc[1].req.user.username;
                    }
                }
                
                var myNotification = new Notification('Benachrichtigung', {
                    body: ntbody,
                    icon: __dirname+'/../favicon.ico'
                });
                
                myNotification.onclick = function(){
                    restore();
                }

                myNotification.onerror = function(err){
                    console.log(err);
                }
    
            }else if(inc[0] == "message" && config.msg.chat == true){
    
    
                $.ajax({
                    type: 'GET',
                    url: 'https://www.dbna.com/json/profile/'+inc[1].sender,
                    data: '',
                    success: function(re){
                        //var redata = JSON.parse(re);
    
                        var myNotification = new Notification('Chat - '+re.profile.username, {
                            body: inc[1].message,
                            icon: __dirname+'/../favicon.ico'
                        });
                        
                        myNotification.onclick = function(){
                            restore();
                            delete myNotification;
                        }
    
    
                    }
                });
    
            }
        }
    
    }

    ws.onclose = function (){
        console.log("[ws] connection closed");
        setTimeout(()=>{
            wsconnection();
        },500);
    }
}
wsconnection();