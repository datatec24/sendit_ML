/*
 * This controller is to be used for interraction between the node server and the python algorithms
 */


var config = require('../config');
var pshell = require('python-shell');
var errorMessage = false;
var errorMessageCount = 0;
var fs = require('fs');

function isin(list, message){
    for (var i = 0; i < list.length; i++){
        if(message.includes(list[i])){
            return true;
        }
    }
    return false;
}

function past_context(context, intent){
    i = 0;
    while (typeof context[i] !== 'undefined'){
        if(context[i].intent[0] == intent){
            return true;
        }
        else{
            i++;
        }
    }
    return false;
}


function talkToPython(inputStr, context, num_message, senderId, callback, reset) {

    console.log('talkToPython is launched');

   // if (context.arbre && context.arbre['nom']==="cartes_sim"){
   //   path = './tmp/cartes_sim'
   //   deep = "False"
   //   model_name = context.arbre['context'] + '/' + 'svm_linear?p=0.5'
   //   threshold = 0.01
   //   console.log(model_name)
   //
   //   console.log(context.arbre['context'])
   //   console.log(context.arbre['context']==='0')
   //
   //   if (context.arbre['context']==='0'){
   //     tache ='classification'
   //   }
   //   else if (context.arbre['context'].length){
   //     tache ='NER'
   //   }
   //
   // }
   //
   console.log(context.reponses[num_message-1]==="Il semble que vous ayiez atteint mes limites :slightly_smiling_face: Un de mes collègues humain va prendre le relais :wink: Pouvez-vous lui détailler un peu plus votre problème :slightly_smiling_face: ?");
   if (context.reponses[num_message-1]=="Nous avons bien pris en compte votre problème. Avant de passer la main à un conseiller, nous aurions besoin de votre email et numéro de téléphone"){
       path1='./tmp/intent'
       deep1= "False"
       model_name1='reglog_l1?p=1.0'
       threshold1=0.01
       tache1='NER'
       path2='./tmp/sentiment'
       deep2 = "False"
       model_name2='reglog_l1?p=1.0'
       threshold2=0.01
       tache2='classification'
       var options = {
           mode: 'text',
           pythonPath:  config.pythonPath,
           pythonOptions: ['-u'],
           scriptPath: config.pythonScriptsPath,
           args: [inputStr,path1,deep1,model_name1,threshold1,tache1,path2,deep2,model_name2,threshold2,tache2]
       };

   }
   else {
       path1='./tmp/intent'
       deep1= "False"
       model_name1='reglog_l1?p=1.0'
       threshold1=0.01
       tache1='classification'
       path2='./tmp/sentiment'
       deep2 = "False"
       model_name2='reglog_l1?p=1.0'
       threshold2=0.01
       tache2='classification'

       var options = {
           mode: 'text',
           pythonPath:  config.pythonPath,
           pythonOptions: ['-u'],
           scriptPath: config.pythonScriptsPath,
           args: [inputStr,path1,deep1,model_name1,threshold1,tache1,path2,deep2,model_name2,threshold2,tache2]
       };

   }





    pshell.run('predict.py', options, function (err, results) {
        if (err){
          console.log('Erreur script Python',err)
        };
        // results is an array consisting of messages collected during execution
        console.log('results du script python: %j', results);

        var str = "";
        results.forEach(function(element){str = str + element;});
        console.log('on affiche le string',str);

        parsingJSON(JSON.parse(str), context, num_message, senderId, callback, reset);

    });

}


function parsingJSON(json, context, num_message, senderId, sendCallback, reset) {

    //context[num_message] = json;
    console.log(json)
    console.log(context)

    // for the condition below to work with num_message even if we did not understood one stuff [num_message will return as it was at the end]
    num_message_copy = num_message;
    var output;
    //console.log(context.reponses[num_message-1])
    if (context.reponses[num_message-1] == "Nous n'avons pas compris votre message, pouvez-vous le reformuler s'il vous plaît?"){
        if (context.reponses[num_message-2] == "Nous n'avons pas compris votre message, pouvez-vous le reformuler s'il vous plaît?"){
            num_message -= 2;
        }
        else {
            num_message -= 1;
        }
    }

    if (context.reponses[num_message-1]==="Il semble que vous ayiez atteint mes limites :) Un de mes collègues humain va prendre le relais ;) Pouvez-vous lui détailler un peu plus votre problème :) ?"){
        context.problem = json[path1].message;
        context.classification = json[path1].intent[0];
        context.classification_accuracy = json[path1].accuracy[0];

        if( isin(["ener","éner","scan","abus","resi","rési","insu"],json[path1].message) ){
           context.sentiment = 0.1242;
           context.sentiment_accuracy = 0.97;
        }
        else{
            context.sentiment = json[path2].intent[0];
            context.sentiment_accuracy = json[path2].accuracy[0];
        }
        if(context.sentiment>0.5){
            context.sentiment = "positif"
        }
        else{
            context.sentiment = "négatif"
        }
        output = "Nous avons bien pris en compte votre problème. Avant de passer la main à un conseiller, nous aurions besoin de votre email et numéro de téléphone";
        sendCallback("text", output, senderId);

    }

    else if(context.reponses[num_message-1]=="Il semble que vous ayiez atteint mes limites :) Un de mes collègues humain va prendre le relai ;) Pouvez-vous lui détailler un peu plus votre problème :) ?"){

      context.probleme = json.message;
      context.classification_agent = json.intent[0];
      context.accuracy = json.accuracy[0];
      context.humeur = 'neutre';


      output = "Nous avons bien pris en compte votre problème. Avant de passer la main à un conseiller, nous aurions besoin de votre email et numéro de téléphone";
      sendCallback("text", output, senderId);
    }

    else if (context.reponses[num_message-1]=="Nous avons bien pris en compte votre problème. Avant de passer la main à un conseiller, nous aurions besoin de votre email et numéro de téléphone" || context.reponses[num_message-1]=="Nous avons mal compris vos informations. Pouvez-nous nous les redonner svp.") {
        var mail = json.email;
        var phone = json.phone;
        var bank = json.bank;
        var zipcode = json.zipcode;

        var str = "";

        if (mail && !isSetMail()) { str = str + "Adresse email : " + mail + ". \n\n";}
        if (phone && !isSetPhone()) { str = str + "Telephone : " + phone + ". \n\n";}
        //if (bank && !isSetMail()) { str = str + "Banque : " + bank + ". \n\n";}
        //if (zipcode && !isSetPhone()) { str = str + "Code Postal : " + zipcode + ". \n\n";}

        if (mail || phone) {
            context.mail = mail;
            context.numero = phone;
            output = {};
            output.text = "Vous nous avez transmis les informations suivantes : \n\n" + str + "Confirmez-vous ces informations?";
            output.proposals = [{
                    "type":"postback",
                    "title":"Oui",
                    "payload":"payloadOuiGiveInfos"},
                    {"type":"postback",
                     "title":"Non",
                     "payload":"payloadNonGiveInfos"}
                ];
            sendCallback("button", output, senderId);
        }
        else {
            errorMessage = true;
            errorMessageCount += 1;
        }
    }

    else if (context.reponses[num_message-1]=='Nous avons bien enregistré vos informations. Un conseiller va prendre le relai. Pour vous faire patienter, je vous propose le nouveau clip Red' || context.reponses[num_message-1]=="Un conseiller sera bientôt disponible. Merci de patienter svp."){
      output={};
      output = "Un conseiller sera bientôt disponible. Merci de patienter svp.";
      sendCallback("text", output, senderId);
    }

    // else if (json.intent[0] == "greetings") {
    //     if (json.entities.person) {
    //         var person = json.entities.person;
    //         output = "Bonjour " + person + ", que pouvons-nous faire pour vous?";
    //     }
    //     else {
    //         output = "Bonjour, que pouvons-nous faire pour vous?";
    //     }
    //     sendCallback("text", output, senderId);
    // }
    // else if (json.intent[0] == "thanks") {
    //     output = "Mais de rien, ce fut un plaisir de vous conseiller. Puis-je faire autre chose?";
    //     sendCallback("text", output, senderId);
    // }
    //
    // else if (json.intent[0] == 'SFR Presse') {
    //     output = "J'ai bien compris que vous nous contactiez à propos du service SFR Presse, pouvez vous préciser votre demande?";
    //     sendCallback("text", output, senderId);
    // }

    else if (context.arbre['nom']==="cartes_sim" && context.arbre['context']==="0"){
      console.log("On rentre ALLLLLLLL")
      data = fs.readFileSync(config.pythonScriptsPath + 'tmp/cartes_sim/tree.json');
      tree = JSON.parse(data);

      Object.keys(tree).forEach(function(key){
        if (tree[key][0]==json.intent[0]){
          lab = key
        }
      })

      message = tree[lab][1]
      console.log(message)
      sendCallback("text",message,senderId);
      context.arbre['context'] = context.arbre['context'] + '_' + lab;
    }

    else if (context.arbre['context']==="0_1"){
        if (json.entities.email){
            var mail = json.entities.email;
        }
        if (json.entities.phone){
            var phone = json.entities.phone;

        }
        if (json.entities.bank){
            var bank = json.entities.bank;
        }
        if (json.entities.zipcode){
            var zipcode = json.entities.zipcode;
        }

      var str = "";

      if (mail && !isSetMail()) { str = str + "Adresse email : " + mail + ". \n\n";}
      if (phone && !isSetPhone()) { str = str + "Telephone : " + phone + ". \n\n";}
      //if (bank && !isSetMail()) { str = str + "Banque : " + bank + ". \n\n";}
      //if (zipcode && !isSetPhone()) { str = str + "Code Postal : " + zipcode + ". \n\n";}

      if (mail || phone) {
          context.mail = mail;
          context.numero = phone;
          output = {};
          output.text = "Merci pour les informations transmises, possédez vous un numéro de carte SIM?";
          output.proposals = [
              {"content_type":"text",
              "title":"oui",
              "payload":""},
              {"content_type":"text",
              "title":"non",
              "payload":""}];
          sendCallback("quick_reply", output, senderId);
      }

    }

    else if (json.comprehension==0) {
        errorMessage = true;
        errorMessageCount += 1;
    }

    else if (json.accuracy != 1) {
        output = {};
        output.text = "Vous avez un problème concernant: " + json.intent[0] + "?";
        output.proposals = [{
                "content_type":"text",
                "title":"Oui",
                "payload":"payloadOuiIntent"},
                {"content_type":"text",
                 "title":"Non",
                 "payload":"payloadNonIntent"}
            ];
        sendCallback("quick_reply", output, senderId);
    }
    else {
        errorMessage = true;
        errorMessageCount += 1;
    }


    // on gère les messages d'erreurs
    if (errorMessage && errorMessageCount < 3) {
        errorMessage = false;
        output = "Nous n'avons pas compris votre message, pouvez-vous le reformuler s'il vous plaît?";
        sendCallback("text", output, senderId);
    }
    else if(errorMessage && errorMessageCount == 3){
        errorMessage = false;
        errorMessageCount = 0;
        output = "Recommencons depuis le début : Bonjour, quel est votre problème?";
        reset(senderId); // reset the context and num_message variables.
        sendCallback("text", output, senderId);
        return;
    }


    // on stock les messages envoyés
    num_message = num_message_copy;  // on redonne à num_message sa vraie valeur

    if (typeof output === 'object'){
        context.reponses[num_message] = output.text;
    }
    else {
        context.reponses[num_message] = output;
    }

    console.log('\n Contexte après réception message %s: \n',num_message,context);

    //console.log('\nprinting context in parsingJSON :\n\n', context);


}


function isSetPhone() {
    /*
     * Tells if phone number had been set by user
     */

    return false;
}

function isSetMail() {
    /*
     * Tells if mails had been set by user
     */

    return false;
}

var exports = module.exports = {};

exports.talkToPython = talkToPython;
