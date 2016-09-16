// 'use strict';


var config = require('../config');
var request = require('request');
var fs = require('fs');
//var mainCtrl = require('./main-controller');



// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


function doyoufind(sendCallback,senderId){
  output = {};
  output.text = "Avez vous trouvé ce que vous cherchiez?";
  output.proposals = [
      {"content_type":"text",
      "title":"oui",
      "payload":"finish"},
      {"content_type":"text",
      "title":"non",
      "payload":"passer_conseiller"}];
  setTimeout(function(){ sendCallback("quick_reply", output, senderId); }, 5000);
}



function load_node(payload,senderId,sendCallback){


  json = JSON.parse(fs.readFileSync('./scripts/dispatcher.json'));
  node = json[payload];

  if (!node){
    json = JSON.parse(fs.readFileSync('./scripts/payback.json','utf8'));
    node = json[payload];
  }


  console.log("le json[payload] : ",node)
  console.log(node['text'])

    // console.log(Object.keys(node),['generic','text']);
    // console.log(Object.keys(node)[1],['generic','text'][1])
    // console.log(Object.keys(node)==['generic','text']);

    if(Object.keys(node).equals(['quick_reply'])){
      //console.log("node",node);
      //console.log(mainCtrl.sendCallback)
      //console.log(sendCallback)
      //console.log('Dans un noeud de type quick_reply, second argument est',node['quick_reply']['output'])
      console.log(node['quick_reply']['output'])
      sendCallback("quick_reply", node['quick_reply']['output'], senderId);
      return node['quick_reply']['output']
    }

    else if(Object.keys(node).indexOf("faq") >= 0){
      console.log("On est dans la partie Faq", node);
      sendCallback("text", node['text']['output'], senderId);
      sendCallback("generic", node['generic']['output'], senderId);
      doyoufind(sendCallback, senderId);
      return node['text']['output']
    }

    else if (Object.keys(node).equals(['text','generic']) || Object.keys(node).equals(['generic','text'])){
      sendCallback("text", node['text']['output'], senderId);
      sendCallback("generic", node['generic']['output'], senderId);
      return node['text']['output']
    }

    else if(Object.keys(node).indexOf("button") >= 0){
      console.log("Titre ?",Object.keys(node).indexOf("text") >= 0);
      console.log("Le output qu'on envoie",node['button']['output'])

      if(Object.keys(node).indexOf("text") >= 0){
        sendCallback("text", node['text']['output'], senderId);
      }
      sendCallback("button", node['button']['output'], senderId);
      if(Object.keys(node).indexOf("image") >= 0){
        for (var i =0;i<node['image']['output'].length;i++){
            sendCallback("image", node['image']['output'][i], senderId);
        }
      }
      if(Object.keys(node).indexOf("generic") >= 0){
          setTimeout(function(){
              sendCallback("generic", node['generic']['output'], senderId);
          }, 1000);
      }
      if(Object.keys(node).indexOf("text") >= 0){
        return node['text']['output']
      }
      else{
        return node['button']['output']['text']
    }
   }

   else if(Object.keys(node).equals(['text'])){
     console.log('On est dans la partie que texte')
     console.log(node['text']['output'])
     sendCallback("text", node['text']['output'], senderId);
     return node['text']['output']
   }

   else{
      console.log(";) DEV ERR : Schéma de noeud non reconnu ou payload non défini");
   }
}


var exports = module.exports = {};

exports.load_node = load_node;


// json = JSON.parse(fs.readFileSync('./scripts/payback.json','utf8'));
// pay = "http://communaute.red-by-sfr.fr/t5/FAQ/Comment-activer-votre-nouvelle-carte-SIM-RED/ta-p/60"
// console.log(json[pay]['button']['output']['text'])
