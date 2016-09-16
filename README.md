# Messenger Bot

This is a implementation of a bot for messenger. It uses a webhook that listen to POST event on a facebook page (ie : when a user send a message to that page), and alert a node.js server. The server then use facebook send API to send back the appropriate answer, that will of course be powered by some mystic pythonic algorithms.

## Getting Started
Frist things first, you should have a look at this page, carefully craft by facebook devs : https://developers.facebook.com/docs/messenger-platform/quickstart

## Set up

### Node stuff:
* We need a *"real url"* for our webhook (meaning not a localhost), because facebook will only accept verified urls. Ngrok is the tool for this purpose. Download ngrok there : https://ngrok.com. Put the binary in usr/local/bin or your equivalent directory linked to your $PATH environment variable. Then use from anywhere in the terminal `ngrok http 8888` to set up an url such as https://55feb1ab.ngrok.io. This will be your reverse proxy for your localhost.
* Download nodemon with the command : `npm install nodemon -g`, so that you won't have to relauch the node server every time (better than re-starting with node index.js everytime)
* Launch the server using the command : `nodemon index.js`. You can update it anytime with the command `rs` (restart server)
* Type `npm install` from the working directory in your terminal to get the node_modules needed for our node.js server.

### Facebook stuff:
* Create a facebook app there : https://developers.facebook.com. Then go to your app settings and under **Products** add a product and select *Messenger* and *Webhooks*
* Go to the **Products/webhooks** tab and set up a webhook at the ngrok url with any verify_token. Subscribe to *message_deliveries*, *messages*, *messaging_optins*, *messaging_postbacks* fields
* Go to the **Products/Messenger** tab and get your page access token by selecting the facebook page you want to use (in Token Generation section).
* Still on the **Products/Messenger** tab, subscribe the app to the page in the Messenger tab, in the Webhooks section.
* To finish with, create a *config.js* file such as below and update it with the corresponding parameters. Carefully choose your python path (use `which python` in the terminal to know) and your python repository path where your *predict.py* script is. You should use port 8888.
```javascript
var config = {};

config.FB_VERIFY_TOKEN = "VERIFY_TOKEN";
config.FB_PAGE_TOKEN="ACCESS_TOKEN";
config.SERVER_URL = "WEBHOOK_URL";
config.port = 8888;

config.pythonScriptsPath = "PATH_TO_PYTHON_SCRIPT";
config.pythonPath = "PATH_TO_PYTHON_REPO"

module.exports = config;
```
### Now, go talk to your page and enjoy!

## Build

* `make_faqjson.js` generate `faq_step.json` and then `faq.json`, that is used in `make_dispatcher_tree.js` to make the tree structure.
* `make_dispatcher_tree.js` generate the code for the quick replies used for the tree structure, using `faq.json`. This code is to be copy pasted in the `button-controller.js`.
* `make_read_here.js` generate the code for the read here button on the generic template pushed to the user, using `link2answer.json`, the scraping result. `link2answer.json` is formated in python so that it match the 320 characters limits, and it extract the link and image of the FAQ. This code is to be copy pasted in the `main-controller` in the *receivedPostback* function.
* `link2newlink.json` is mainly used in `make_dispatcher_tree.js`>`make_generic_node` function to update old links, so that it will works with the payload of the `link2answer.json` file (that has only new urls as it was just scraped)
* `motifs.json` is used in `make_dispatcher_tree.js`>`make_quickreply_node` function to update the categories exceeding 20 characters (for complying to the fb messenger API restriction for quick reply items.)

## How it works

* request are incoming in `index.js`. This is where we instanciate the app and where we listen to facebook messenger event though a webhook. Incoming message can be of two types:
** **postback**, that are the payload of our button & generic templates. Those are handled in `mainCtrl.receivedPostback` function.
** **message**, that are either a text message for the user, or the payload of a quick reply. Those are handle in 'mainCtrl.receivedMessage' function.
* `main-controller.js` is mainly composed of four elements:
** `gettingStarted`, `greetingText` & menu that are three function that need to send a POST request once in order to set up the getting started button, the menu button...
** `receivedMessage` & `receivedPostback`, as mention earlier (note the read_here buttons payload in the `receivedPostback` function)
** `sendCallback`, that is used as a callback that triggers the sendAPI for `python-controller` and `button-controller`. `sendHelpMessage`, `sendTextMessage`, `sendButtonMessage`, `sendQuickReply`, etc... are functions that parse the output to the fb json format.
** `callSendAPI`, to finish with, is the function that actually call the fb send API.
* `button-controller.js` is handling quick reply's payload
* `python-controller.js` is handling machine learning features.

## To be careful about

* payload are limited to 1000 characters
* text is limited to 320 characters
* quick replies are limited to 20 characters

## Deployment on heroku

* `heroku create senditsfrbot`, `heroku logs`, `heroku ps`, `heroku run bash`, `git add .`, `git commit -m 'your_commit'`, `git push heroku master`
* pos_tagging not working because of compilation in 84 format (cf tree tagger), okk
* nltk_data a downloader (stopwords), cf *http://stackoverflow.com/questions/13965823/resource-corpora-wordnet-not-found-on-heroku*
* *requirement.txt* is used to install python dependencies
* *package.json* is used to install node dependencies
* Procfile is stating how to start our node server (node index.js)
* need SSL https:// for use as a facebook messenger webhook. If hosted on example.herokuapp.com, it will work, but if not, we need to pay for a SSL subscription.
