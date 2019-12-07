//import modules
const WebSocket = require("ws");
const socketIOParser = require("./socket.io-parser.js");

//set configuration variables
var idCount = 0;
var pingInterval = 25000;

var ackQueue = {};
var events = {};

var ws = null;

module.exports = function(wsurl, protocols, options, debug = false){

    ws = new WebSocket(wsurl, protocols, options);

    //listen for events 
    ws.on("open", ()=>{
        //print debug message
        if(debug) console.log("[ws: connection] Successful connected");

        if(events["open"]){
            events["open"]();
        }

    });

    ws.on("message", (msg)=>{

        //print debug message
        if(debug) console.log("[ws: message] " + msg);

        //parse the incomming message
        msg = socketIOParser.parseMessage(msg);
        

        if(msg.type == "init"){

            pingInterval = msg.data.pingInterval;
            setTimeout(()=>{
                if(debug) console.log("[ws: send] 2");
                ws.send("2");
            }, pingInterval);

        }else if(msg.type == "pingAnswer"){

            setTimeout(()=>{
                if(debug) console.log("[ws: send] 2");
                ws.send("2");
            }, pingInterval);

        }else if(msg.subtype == "answer" && ackQueue[msg.id.toString()]){

            ackQueue[msg.id.toString()](msg.data);

        }else{

            if(events[msg.event]){

                events[msg.event](msg);

            }else{
                if(events["rawMessage"]){
                    events["rawMessage"](msg);
                }
            }

        }
    });

};

module.exports.on = function(event, func){
    events[event] = func;
}

module.exports.send = function(msgObject, ack = false){

    if(typeof(ack) == "function"){
        ackQueue[idCount] = ack;
    }

    msgObject.subtype = "action";

    //get current message id and increase it
    msgObject.id = idCount;
    idCount++;

    msgObject.data = msgObject.data ? msgObject.data : {};

    var newMessage = socketIOParser.stringifyMessage(msgObject);

    console.log("[ws: send] " + newMessage);

    ws.send(newMessage);

}