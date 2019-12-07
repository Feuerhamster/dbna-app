module.exports = function(cdsessToken, config){

    const SocketClient = require("./socketClient.js");

    var url = "wss://www.dbna.com/chat-server/socket.io/?EIO=3&transport=websocket";

    SocketClient(url,[],{
        'headers': {
            'Cookie': 'cdsess=' + cdsessToken
        }
    }, false);

    SocketClient.on("message", (msg)=>{
        if(config.msg.general && config.msg.chat){

            SocketClient.send({ type: "event", event: "history", data: {peer: msg.data.sender, limit: 1, thumb: true} }, (peers)=>{
                console.log(peers.thumb.username + ": " + msg.data.message);
            });

        }
    });

}