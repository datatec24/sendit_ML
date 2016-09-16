/*
 * This controller prints multiple choices answers with buttons to the talking user.
 */

var config = require('../config');
var request = require('request');
var nodeCtrl = require('./node-controller.js');


function payloadAnalyser(event,sendCallback, context, num_message, reset) {

    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;

    try {
        var payload = event.message.quick_reply.payload;
    }
    catch(e){
        var payload = event.postback.payload;
    }

    var output;
    var output2;


    if (payload == "payloadOuiGiveInfos") {
      output = "Nous avons bien enregistré vos informations. Un conseiller va prendre le relais. Pour vous faire patienter, je vous propose le nouveau clip Red";
      sendCallback("text", output, senderId);
      sendCallback('video', '/assets/clip.mp4', senderId)
    //   output = {};
    //   output.text = "De 1 à 5, à combien évalueriez vous ce service?";
    //   output.proposals = [
    //       {"content_type":"text",
    //       "title":"1",
    //       "payload":"evaluation"},
    //       {"content_type":"text",
    //       "title":"2",
    //       "payload":"evaluation"},
    //       {"content_type":"text",
    //       "title":"3",
    //       "payload":"evaluation"},
    //       {"content_type":"text",
    //       "title":"4",
    //       "payload":"evaluation"},
    //       {"content_type":"text",
    //       "title":"5",
    //       "payload":"evaluation"}];
    setTimeout(function(){ 
             context=reset(senderId, context);
        }, 2000);

    //   sendCallback("quick_reply", output, senderId)

    }
    else if (payload == "payloadNonGiveInfos") {
        output = "Nous avons mal compris vos informations. Pouvez vous nous les transmettre à nouveau?";
        sendCallback("text", output, senderId);
    }
    else if (payload == "payloadOuiIntent") {
        output = "Pouvez-vous nous donner votre adresse mail et numéro de téléphone afin de poursuivre la résolution de votre problème s'il-vous-plaît?";
        sendCallback("text", output, senderId);
    }
    else if (payload == "payloadNonIntent") {
        output = "Excusez-nous, pouvez-vous reformuler votre question s'il-vous-plaît.";
        sendCallback("text", output, senderId);
    }
    else if (payload == "finish") {
        output = "Ce fut un plaisir de vous aider. N'hésitez pas à revenir vers moi si d'aventure vous avez une nouvelle question.";

        output2 = {};
        output2.text = "De 1 à 5, à combien évalueriez vous ce service?";
        output2.proposals = [
           {"content_type":"text",
           "title":"1",
           "payload":"evaluation"},
           {"content_type":"text",
           "title":"2",
           "payload":"evaluation"},
           {"content_type":"text",
           "title":"3",
           "payload":"evaluation"},
           {"content_type":"text",
           "title":"4",
           "payload":"evaluation"},
           {"content_type":"text",
           "title":"5",
           "payload":"evaluation"}];

           setTimeout(function(){
               sendCallback("text", output, senderId);
             setTimeout(function(){
               sendCallback("quick_reply", output2, senderId);
             }, 1500);
         },1500);
    }
    else if (payload == "evaluation") {
        var output = "Merci pour votre retour, nous nous améliorons chaque jour grâce à vos feedback. A bientôt sur messenger!"
        sendCallback("text", output, senderId);
        var output = "Vous pouvez maintenant vous déconnecter de votre compte SFR :)"
        sendCallback("unlinking", output ,senderId);
        setTimeout(function(){
             context=reset(senderId, context);
        }, 2000);
        console.log('le contexte est remis à zero, context/num_message:', context, num_message);

    }

    else if (payload == "passer_conseiller") {
        output = "Il semble que vous ayiez atteint mes limites :) Un de mes collègues humain va prendre le relais ;) Pouvez-vous lui détailler un peu plus votre problème :) ?";
        sendCallback("text", output, senderId);
    }

    else if (payload == 'stop'){
      output = {};
      output.text = "Avez vous trouvé ce que vous cherchiez?";
      output.proposals = [
          {"content_type":"text",
          "title":"oui",
          "payload":"finish"},
          {"content_type":"text",
          "title":"non",
          "payload":"passer_conseiller"}];
      sendCallback("quick_reply", output, senderId)
    }

    else if (payload == "nouvelle_question") {
        output ={};
        output.text = "Une nouvelle question? Cette fois ci vous nous contactez pour :) ?";
        output.proposals = [
           {"content_type":"text",
           "title":"Forfait Mobile",
           "payload":"0_0"},
           {"content_type":"text",
           "title":"Fibre, Box",
           "payload":"0_1"},
           {"content_type":"text",
           "title":"Pas encore Client",
           "payload":"0_2"}
        ];
        sendCallback('quick_reply',output,senderId);
    }

    else if(payload == "gettingStarted" ){
        introduction = "Bonjour " + context.first_name + " " + context.last_name + ".";
        introduction2 = "Je suis Reddie, votre assistant virtuel :)";
        output = "Tout d'abord veuillez vous connecter à votre compte Red SFR :)"
        sendCallback("text", introduction, senderId);
        sendCallback("text", introduction2, senderId);
        sendCallback("linking", output, senderId);
    }

    else if (payload == "0") {
       output = {};
       output.text = "Tout d'abord, vous êtes client?";
       output.proposals = [
          {"content_type":"text",
          "title":"Forfait Mobile",
          "payload":"0_0"},
          {"content_type":"text",
          "title":"Fibre, Box",
          "payload":"0_1"},
          {"content_type":"text",
          "title":"Pas encore Client",
          "payload":"0_2"}
       ];
       sendCallback('quick_reply',output,senderId);
    }
    else if (payload == "no_account_linking"){
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

        sendCallback("text", introduction, senderId);
          setTimeout(function(){
            sendCallback("text", output.text, senderId);
            setTimeout(function(){
              sendCallback("generic", output, senderId);
            }, 1500);
        },1500);
    }

    else {
        output = nodeCtrl.load_node(payload, senderId, sendCallback);
    }


    // on enregistre les reponses
    if (output){
        if (output.text){
            context.reponses[num_message] = output.text;
        }
        else {
            context.reponses[num_message] = output;
        }
    }


    // if (payload=='0_0_1_1_0'){
    //   context.arbre = {};
    //   context.arbre['nom']="cartes_sim"
    //   context.arbre['context']='0'
    // }

    console.log('\n Contexte après réception message %s: \n',num_message,context);
}


var exports = module.exports = {};

exports.payloadAnalyser = payloadAnalyser;
