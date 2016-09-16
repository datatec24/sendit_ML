/*
 * Defines all de functions used to parse incoming Jsons and ignite answers.
 */

// 'use strict';

const
    config = require('../config'),
    request = require('request'),
    buttonCtrl = require('./button-controller'),
    pythonCtrl = require('./python-controller'),
    nodeCtrl = require('./node-controller');


//In receivedMessage, we've made logic to send a message back to the user. The default behavior is to use the fonction talktopython.

function receivedMessage(event, context, num_message, reset) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;

    if(event.message){
      var message = event.message;
      console.log("Received message for user %d and page %d at %d with message:", senderId, recipientId, timeOfMessage,JSON.stringify(message));
      var messageId = message.mid;
      // You may get a text or attachment but not both
      var messageText = message.text;
      var messageAttachments = message.attachments;
    }
    else if (event.account_linking){
        var status = event.account_linking.status;
        var authCode = event.account_linking.authorization_code;

        console.log("Received account link event with for user %d with status %s and auth code %s ", senderId, status, authCode);

        if (status == 'linked'){
            sendTextMessage(senderId, "Vous vous êtes correctement connecté :)");

            var output = {};
            introduction = "Je vais vous poser plusieurs questions pour résoudre votre problème plus rapidement B-) Mais rassurez-vous, mes collègues humains prendront le relais si besoin :) ";
            output.text = "Tout d'abord, vous êtes client...";
            output.proposals = [
                {"title":"Forfait Mobile",
                 "image_url":"http://www.s-sfr.fr/media/gred-telmobile-maxi.png",
                 "buttons": [
                   {"type":"postback",
                   "title":"Cliquez ici",
                   "payload":"0_0"}]
                },
                {"title":"Fibre, Box",
                "image_url":"http://www.s-sfr.fr/media/gred-box-maxi1.png",
                 "buttons": [
                   {"type":"postback",
                   "title":"Cliquez ici",
                   "payload":"0_1"}]
                },
                {"title":"Pas encore client",
                "image_url":"http://www.s-sfr.fr/media/gred-caddie-maxi.png",
                 "buttons": [
                   {"type":"postback",
                   "title":"Cliquez ici",
                   "payload":"0_2"}]
                }
            ];

            sendTextMessage(senderId, introduction);
              setTimeout(function(){
                sendCallback("text", output.text, senderId);
                setTimeout(function(){
                  sendCallback("generic", output, senderId);
                }, 1500);
            },1500);
            if (output.text){
              context.reponses[num_message] = "linking account, bonjour + " + output.text;
            }
            else {
              context.reponses[num_message] = "linking account, bonjour + " + output;
            }
            console.log('\n Contexte après réception message %s: \n',num_message,context);
        }

        else{
            sendTextMessage(senderId, "Vous vous êtes correctement déconnecté :)");
        }
    }

    else {
      var payload = event.postback.payload;
    }


    // trois cas : soit payload (ci dessous), soit mot clef (le else if avec switch), soit python (le else)
    if((event.message && event.message.quick_reply)||(event.postback)){
        buttonCtrl.payloadAnalyser(event,sendCallback, context, num_message, reset);
    }


    else {
        // message texte brute (ie pas un quick_reply)

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, call the python script

        // initialization

        // if(num_message == 0){
        //     context.reponses[num_message-1]="Il semble que vous ayiez atteint mes limites :) Un de mes collègues humain va prendre le relais ;) Pouvez-vous lui détailler un peu plus votre problème :) ?"
        //     pythonCtrl.talkToPython(messageText, context, num_message, senderId, sendCallback,reset);
        // }

        if(num_message == 0 || context.reponses[num_message-1]=="Ce fut un plaisir de vous aider. N'hésitez pas à revenir vers moi si d'aventure vous avez une nouvelle question."){
            introduction = "Bonjour " + context.first_name + " " + context.last_name + ".";
            introduction2 = "Je suis Reddie, votre assistant virtuel :)";
            output = "Tout d'abord veuillez vous connecter à votre compte Red SFR :)";
            sendTextMessage(senderId, introduction);
            setTimeout(function(){
                 sendTextMessage(senderId, introduction2);
                 setTimeout(function(){
                     sendAccountLinking(senderId, output);
                 }, 1000);
            }, 1000);
        }
        else{
            switch (messageText) {
                case 'aide':
                case 'help':
                    var output = "vous pouvez me posez des questions pièges, n'hésitez pas."
                    sendHelpMessage(senderId, output);
                    if (output.text){
                        context.reponses[num_message] = output.text;
                    }
                    else {
                        context.reponses[num_message] = output;
                    }
                    console.log('\n Contexte après réception message %s: \n',num_message,context);
                    break;
                case 'merci':
                    var output = "Mais de rien";
                    sendTextMessage(senderId, output)


                default:
                    pythonCtrl.talkToPython(messageText, context, num_message, senderId, sendCallback, reset);
            }
        }
    }


    if (messageAttachments) {
        sendTextMessage(senderId, "Message with attachment received");
    }

}




















// on définit la callback de la fonction talkToPython, qui est configurée dans python-controller
var sendCallback = function(type, output, senderId) {

    if (type == "text") {
        sendTextMessage(senderId, output);
    }
    else if (type == "button") {
        sendButtonMessage(senderId, output.text, output.proposals);
    }
    else if (type == "quick_reply") {
        sendQuickReply(senderId, output.text, output.proposals);
    }
    else if (type == "generic") {
        sendGenericMessage(senderId, output.proposals);
    }
    else if (type == "video") {
        sendVideoMessage(senderId, output);
    }
    else if (type == "image") {
        sendImageMessage(senderId, output);
    }
    else if (type == 'linking') {
        sendAccountLinking(senderId, output);
    }
    else if (type == 'unlinking'){
        sendAccountUnlinking(senderId, output);
    }
};


// the functions below are parsing the messageText / proposals / recipientId in the right format for the send API.
function sendHelpMessage(senderId, messageText) {
    var messageData = {
        recipient: {
        id: senderId
        },
        message: {
        text: messageText
        }
    };
    callSendAPI(messageData);
}

function sendTextMessage(senderId, messageText) {
    var messageData = {
        recipient: {
        id: senderId
        },
        message: {
        text: messageText
        }
    };
    callSendAPI(messageData);
}

function sendButtonMessage(senderId, messageText, proposals) {
    var messageData = {
        recipient: {
            id: senderId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: messageText,
                    buttons: proposals
                }
            }
        }
    };
    callSendAPI(messageData);
}

function sendQuickReply(senderId, messageText, proposals) {
    var messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText,
            quick_replies: proposals
        }
    };
    callSendAPI(messageData);
}

function sendGenericMessage(senderId, proposals) {
  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: proposals
        }
      }
    }
  };
  callSendAPI(messageData);
}

function sendVideoMessage(senderId, videoUrl) {
  console.log('sending video')
  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
            url: config.SERVER_URL + videoUrl
        }
      }
    },
    // filedata: videoUrl  // need to be like "@/tmp/clip.mp4;type=video/mp4"
  };
  callSendAPI(messageData);
}

function sendImageMessage(senderId, imageUrl) {
  console.log('sending image')
  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
            url: config.SERVER_URL + imageUrl
        }
      }
    },
    // filedata: videoUrl  // need to be like "@/tmp/clip.mp4;type=video/mp4"
  };
  callSendAPI(messageData);
}

function sendTypingOn(senderId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: senderId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

function sendTypingOff(senderId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: senderId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}

function sendAccountLinking(senderId, messageText) {
  console.log("Inside sendAccountLinking");

  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: messageText,
          buttons:[{
            type: "account_link",
            url: config.SERVER_URL + "/authorize"
          },
          {
            type:"postback",
            title:"Ne pas se connecter",
            payload:"no_account_linking"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendAccountUnlinking(senderId, messageText){
  console.log("Inside sendAccountUnlinking ");

  var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: messageText,
          buttons:[{
            type: "account_unlink",
            url: config.SERVER_URL + "/authorize"
        }]
        }
      }
    }
  };
  callSendAPI(messageData);
};



// callSendAPI calls the Send API and effectively send the message through messenger.
function callSendAPI(messageData) {
    //console.log(messageData);
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: config.FB_PAGE_TOKEN },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            //console.error(response);
            console.error(error);
        }
    });
}



var exports = module.exports = {};

exports.callSendAPI = callSendAPI;

exports.sendTextMessage = sendTextMessage;
exports.sendButtonMessage = sendButtonMessage;
exports.sendQuickReply = sendQuickReply;

exports.receivedMessage = receivedMessage;
//exports.receivedPostback = receivedPostback;
exports.sendCallback = sendCallback;
