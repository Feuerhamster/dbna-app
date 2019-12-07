/*
Socket.IO Message parser

Example: 

    Message: 4251["unread",{}]

    First digit:        Type (1 = init; 2 = ping; 3 = ping answer; 4 = event)
    Second digit:       Request or answer? (2 = requested; 3 = answer to request)
    Folowing digits:    Counter that counts every message 1 higher

*/

// define the types
const messageTypes = {
    0: "init",
    2: "ping",
    3: "pingAnswer",
    4: "event"
}

const reverseTypeObject = {
    init: 0,
    ping: 2,
    pingAnswer: 3,
    event: 4
}

//Second digit: Outgoing request or incoming answer?
const subtype = {
    2: "action",
    3: "answer"
}

/*
regular expression for matching the single digits and the other values
*/
const msgRegex = /^(\d{1})(\d{1})(\d*)\[\"?(\w+)\"?\,(.+)\]$/im;

//export the function that builds a message object
module.exports.parseMessage = function(msgString){

    //execute regex on message
    var result = msgRegex.exec(msgString);
    
    //create message object
    let msgObject = {
        type: null,
        subtype: null,
        id: null,
        event: null,
        data: null
    }

    //check if the message type exists. If yes, put it into the message object.
    if(result && messageTypes[result[1]]){
        msgObject.type = messageTypes[result[1]];
    }

    //check if the direction exists. If yes, put it into the message object.
    if(result && subtype[result[2]]){
        msgObject.subtype = subtype[result[2]];
    }

    //set the message id
    if(result && result[3]){
        msgObject.id = parseInt(result[3]);
    }

    //check if the event is set. If yes, put it into the message object.
    if(result && result[4] != "null"){
        msgObject.event = result[4];
    }

    //put the data into the message object
    if(result && result[5]){
        msgObject.data = JSON.parse(result[5]);
    }

    if(msgString == "3"){
        msgObject.type = "pingAnswer";
    }

    if(msgString.startsWith("0")){
        msgObject.type = "init";
        msgObject.data = JSON.parse(msgString.substring(1));
    }
    
    //return the message object
    return msgObject;

}

//exports the function that serialize the 
module.exports.stringifyMessage = function(msgObject){
    //console.log(msgObject);
    //check if the message object is valid
    if(msgObject.type && typeof msgObject.id == "number" && msgObject.event && msgObject.data){

        //get the right type for the message
        let type = reverseTypeObject[msgObject.type] ? reverseTypeObject[msgObject.type] : "";

        //build the message
        return `${ type }${ 2 }${ msgObject.id }["${ msgObject.event }",${ JSON.stringify(msgObject.data) }]`;

    }else{
        //throw error
        throw new TypeError("Message object ist not valid");
    }

}