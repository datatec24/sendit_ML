/**
 * Created by Djou on Jeudi 21 Juillet 2016
 *
 * Featuring Alphabet
 *
 **/

const
    express = require('express'),
    app = express(),
    config = require('./config'),
    mainCtrl = require('./controller/main-controller'),
    buttonCtrl = require('./controller/button-controller'),
    nodeCtrl = require('./controller/node-controller'),
    request = require('request'),
    path = require('path');

// Use morgan to print logs
var morgan  = require('morgan');
app.use( morgan('combined') );

//var request = require('request');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', process.env.PORT || 8888);


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// this variable will store the context for each senderId
var context = {};
var num_message = {};


app.get('/', function(req, res){
    res.sendFile('index.html', { root: __dirname + "/public" } );
});

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

function reset(senderId, context) {
    context = {}
    context.reponse = {};
    num_message[senderId] = -1;
    return context
};

// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/views'));

// app.use(express.static(__dirname + '/views/assets/fonts'))
// app.use(express.static(__dirname + '/views/assets/img'))
// app.use(express.static(__dirname + '/views/assets/js'))



//console.log(path.join(__dirname, './public/assets/logo.jpg'))



app.get('/webhook', function(req, res) {
    //console.log('request:', req);
    //console.log('resultat:', res);
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
        gettingStarted();
        greetingText();
        removePersistentMenu();
        addPersistentMenu();
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.get('/authorize', function(req, res) {
  console.log("\n\n In the app.get /authorize \n\n" )
  var accountLinkingToken = req.query['account_linking_token'];
  var redirectURI = req.query['redirect_uri'];
  console.log('redirectURI : ', redirectURI)
  console.log("accountLinkingToken : ", accountLinkingToken);


  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  var authCode = "1234567890";

  // Redirect users to this URI on successful login
  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;
  console.log("redirectURISuccess : ", redirectURISuccess, '\n');

  //res.render('index', { title: 'gogogogo'});

  res.render('index', {
      accountLinkingToken: accountLinkingToken,
      redirectURI: redirectURI,
      redirectURISuccess: redirectURISuccess,
      path_css: config.SERVER_URL + '/css/style.css',
      path_script: config.SERVER_URL + '/js/index.js'
  });
});

app.post('/webhook', function (req, res) {
    console.log('on entre dans app.POST')
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;

        // Iterate over each messaging event
        pageEntry.messaging.forEach(function(messagingEvent) {

            var senderId = messagingEvent.sender.id
            var message = messagingEvent.message

            //console.log('-----messagingEvent------\n',messagingEvent,'\n\n')

            // 5 types d'event peuvent arriver
            if ((messagingEvent.message && !messagingEvent.message.is_echo)||(messagingEvent.postback)){
              // Event ou le user a soit rédigé un message, soit répondu à une quick_reply, soit à un postback

              if (!context[senderId]){
                context[senderId] = {};
                context[senderId].reponses = {};
                context[senderId].questions = {};
                num_message[senderId] = 0;
              }
              else {
                  num_message[senderId] += 1;
              }

              console.log('__________________________________________ message n°:', num_message[messagingEvent.sender.id], ' _____________________________________________');

              console.log('messagingEvent :', messagingEvent)

              try{
                context[senderId].questions[num_message[senderId]]= message.text
              }
              catch(e) {
                context[senderId].questions[num_message[senderId]]= messagingEvent.postback.payload
              }
              get_user_profile(context, num_message, messagingEvent, receivedCallback);
            }


            else if (messagingEvent.read){
              // Event qui signifie que le message a été lu par le user
            }
            else if (messagingEvent.message && messagingEvent.message.is_echo){
              // Event qui rappelle  le message qui a été envoyé par le serveur node.js
            }
            else if (messagingEvent.delivery){
              // Event pour message bien délivré
            }
            else if(messagingEvent.account_linking){
              console.log('Linking account :',messagingEvent);
              mainCtrl.receivedMessage(messagingEvent);
            }
            else if(messagingEvent.optin){
              console.log('Optin :',messagingEvent);
            }
            else{
              console.log("Webhook received unknown messagingEvent: ", messagingEvent);
            }
        });
    });
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});



function get_user_profile(context, num_message, messagingEvent, receivedCallback){
    if (!context[messagingEvent.sender.id].first_name || typeof context[messagingEvent.sender.id].first_name === 'undefined'){
        var url_user_info = 'https://graph.facebook.com/v2.6/'+messagingEvent.sender.id+'?access_token='+config.FB_PAGE_TOKEN;
        request.get(url_user_info, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            context[messagingEvent.sender.id].first_name = JSON.parse(body).first_name;
            context[messagingEvent.sender.id].last_name = JSON.parse(body).last_name;
            // context[messagingEvent.sender.id].cover = JSON.parse(body).cover;
            // context[messagingEvent.sender.id].education = JSON.parse(body).education;
            // context[messagingEvent.sender.id].hometown = JSON.parse(body).hometown;
            // console.log('-------------- DATA ---------------\n\n\n',JSON.parse(body));
            receivedCallback(messagingEvent);
            }
            else {
                console.error('Error in get_user_profile')
                console.error(response);
                console.error(error);
            }
        });
    }
    else {
        receivedCallback(messagingEvent);
    }
}

function receivedCallback(messagingEvent){
    mainCtrl.receivedMessage(messagingEvent, context[messagingEvent.sender.id], num_message[messagingEvent.sender.id], reset);
}

function gettingStarted() {
  request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings',
     qs: { access_token: config.FB_PAGE_TOKEN },
     method: 'POST',
     json:{
         "setting_type":"call_to_actions",
         "thread_state":"new_thread",
         "call_to_actions":[
             {
                 "payload":"gettingStarted"
             }
         ]
     }
   },function(error, response, body){
     console.log('Boutton démarré dans le pipe')
     //console.log(error)
     //console.log(response)
     //console.log(body)
   });
  };

function greetingText(){

  request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings',
     qs: { access_token: config.FB_PAGE_TOKEN },
     method: 'POST',
     json:{
           "setting_type":"greeting",
           "greeting":{
             "text":"Bienvenue chez SFR Red! Comment puis-je vous aider?"
           }
     }
   },function(error, response, body){
     console.log('Message de bienvenue dans le pipe')
     //console.log(error)
     //console.log(response)
     //console.log(body)
   });
}

function linking_account(recipientID){
  console.log('--------------- On est dans linking account ----------------')
  request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings',
     qs: { access_token: config.FB_PAGE_TOKEN },
     method: 'POST',
     json:{
            "recipient":{
            "id":recipientID
              },
              "message": {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "Welcome to M-Bank",
                      "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                      "buttons": [{
                        "type": "account_link",
                        "url": "https://www.google.fr"
                      }]
                    }]
                  }
                }
              }
            }
          },function(error, response, body) {
              //console.log(response)
              if (error) {
                  console.log('Error LINKING sending messages: ', error)
              } else if (response.body.error) {
                  console.log('Error LINKING: ', response.body.error)
              }
          });
        }

function addPersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: config.FB_PAGE_TOKEN },
    method: 'POST',
    json:{
        "setting_type" : "call_to_actions",
        "thread_state" : "existing_thread",
        "call_to_actions":[
            {
              "type":"postback",
              "title":"Parler à un conseiller",
              "payload":"passer_conseiller"
            },
            {
              "type":"postback",
              "title":"Nouvelle question",
              "payload":"nouvelle_question"
            },
            {
              "type":"web_url",
              "title":"Site web",
              "url":"https://www.red-by-sfr.fr"
            }
        ]
    }
}, function(error, response, body) {
    //console.log(response)
    if (error) {
        console.log('Error MENU sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error MENU : ', response.body.error)
    }
  })
}

function removePersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: config.FB_PAGE_TOKEN },
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[ ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(process.env.PORT || config.port, function () {
    console.log('Example app listening on:',app.get('port'));
    console.log(process.env.PORT);
});

// module.exports = app;

var exports = module.exports = {};
exports.reset = reset;
