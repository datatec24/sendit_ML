// automating node creation with postback (decision trees with multiple choices)


var config = require('./config');
var fs = require('fs');

function get_faq_link(callback){
    // on cherche les liens pour lequel il faut faire un payload
    data = fs.readFileSync('./link2answer.json');
    var links = [];
    json = JSON.parse(data);
    Object.keys(json).forEach(function(key){
        var link = key;
        if (!links.includes(link) && link !== ''){
            links.push(link);
        }
    });
    return callback(links);

}

function addslashes(ch) {
    ch = ch.replace(/\\/g,"\\\\");
    ch = ch.replace(/\'/g,"\\'");
    ch = ch.replace(/\"/g,"\\\"");
    return ch;
}


function make_quickreply_node(list, text, payload, json_results, deep){
    // we keep the limitation of 20 characters for the buttons titles
    data = fs.readFileSync('motifs.json');
    data = JSON.parse(data);
    for (var key in list) {
        if (list[key].length > 19){

            list[key] = data[list[key]];
        }
    }

    json_results[payload] = {};
    json_results[payload].quick_reply ={};
    json_results[payload].quick_reply.output ={};
    json_results[payload].quick_reply.output.text = text;
    json_results[payload].quick_reply.output.proposals = [];

    var i = 0;

    if (payload.length > 1){
      i = 1;
      json_results[payload].quick_reply.output.proposals[0]={};
      var prop = json_results[payload].quick_reply.output.proposals[0];
      prop.content_type ="text";
      prop.title = "Précédent";
      prop.payload = payload.slice(0,-2)
    };

    var j = i;

    for ( i ; i < (list.length + j); i++){
      json_results[payload].quick_reply.output.proposals[i]={};
      var prop = json_results[payload].quick_reply.output.proposals[i]
      prop.content_type = "text";
      prop.title = list[i-j];
      var z = i-j;
      prop.payload = payload + '_' + z ;
    };
    return [json_results, payload, deep];

}

function make_generic_node_dispatcheur(title_list, subtitle_list, item_url_list, image_url_list, text, payload,json_results, deep){
  json_results[payload] = {};
  json_results[payload].generic = {};
  json_results[payload].generic.output = {};
  json_results[payload].generic.output.proposals =[];
  json_results[payload].text = {};
  json_results[payload].text.output = text;
  var tab = json_results[payload].generic.output.proposals;

  var i =0;

  if (payload.length > 1){
    tab[0]={};
    tab[0].title = "Retour au menu précédent";
    tab[0].buttons=[];
    tab[0].buttons[0]={};
    tab[0].buttons[0].type = "postback";
    tab[0].buttons[0].title = "Cliquez ici";
    tab[0].buttons[0].payload = payload.slice(0,-2);
    i = 1;
  }

  var j = i;

  for (i ; i < (title_list.length + j); i++){
    var z = i-j;
    tab[i] = {};
    tab[i].title = title_list[z];
    if (image_url_list.length >0){
      tab[i].image_url = config.SERVER_URL + image_url_list[z];
    }
    tab[i].buttons=[];
    tab[i].buttons[0]={};
    tab[i].buttons[0].type = "postback";
    tab[i].buttons[0].title = "Cliquez ici";
    tab[i].buttons[0].payload = payload+"_"+z;
  }
  return [json_results, payload, deep];

}




function make_generic_node_faq(title_list, subtitle_list, item_url_list, image_url_list, text, payload,json_results, deep){
    return get_faq_link(function(links){
        json_results[payload] = {};
        json_results[payload].generic = {};
        json_results[payload].generic.output = {};
        json_results[payload].generic.output.proposals =[];
        json_results[payload].text = {};
        json_results[payload].text.output = text;
        json_results[payload].faq = true
        var tab = json_results[payload].generic.output.proposals;

        for (var i = 0; i < title_list.length; i++){
          tab[i] = {};
          tab[i].title = subtitle_list[i];
        //   tab[i].subtitle = subtitle_list[i];
        //   tab[i].item_url = item_url_list[i];
          tab[i].image_url = config.SERVER_URL + image_url_list[i];
          if(item_url_list[i] !== ''){
            tab[i].buttons=[];
            tab[i].buttons[0]={};
            tab[i].buttons[0].type = "web_url";
            tab[i].buttons[0].url = item_url_list[i];
            tab[i].buttons[0].title = "Lire sur le web";
            if(links.indexOf(item_url_list[i]) >= 0){
              tab[i].buttons[1]={};
              tab[i].buttons[1].type = "postback";
              tab[i].buttons[1].title = "Lire ici";
              tab[i].buttons[1].payload = item_url_list[i];
            }
          }
        }

        return [json_results, payload, deep];

    });
}

function generate_node(json_data, json_results, payload, deep){

  if(deep ==0){
    [json_results, payload, deep] = make_generic_node_dispatcheur(Object.keys(json_data),
                      [],
                      [],
                      image_entree,
                      list_test[deep],
                      payload,
                      json_results,
                      deep);
  }
  else if(deep==1){
    [json_results, payload, deep] = make_quickreply_node(Object.keys(json_data), list_test[deep],payload,json_results,deep);
  }

  else if(deep>1 && Object.keys(json_data).indexOf("img_link") < 0){
    [json_results, payload, deep] = make_quickreply_node(Object.keys(json_data),
                      list_test[deep],
                      payload,
                      json_results,
                      deep);
  }
  else if(Object.keys(json_data).indexOf("img_link") >= 0){
    [json_results, payload, deep] = make_generic_node_faq(json_data.title,
                      json_data.subtitle,
                      json_data.link,
                      json_data.img_link,
                      "Voici nos solutions immédiates, n'hésitez pas à lire les solutions dans messenger!",
                      payload,
                      json_results,
                      deep);
  }
  else{
    console.log("Erreur dans generate_node")
  }

  // if(Object.keys(json_data).indexOf("img_link") >= 0){
  //
  //   [json_results, payload, deep] = make_generic_node(json_data.title,
  //                     json_data.subtitle,
  //                     json_data.link,
  //                     json_data.img_link,
  //                     "Voici nos solutions immédiates, n'hésitez pas à lire les solutions dans messenger!",
  //                     payload,
  //                     json_results,
  //                     deep);
  // }
  // else{
  //   text = list_test[deep];
  //   //console.log('Avant le quicreply',Object.keys(json_data));
  //   [json_results, payload, deep] = make_quickreply_node(Object.keys(json_data), text,payload,json_results,deep);
  //   //console.log('Apres le quicreply',Object.keys(json_data));
  // }
  callback(json_data,json_results,payload,deep);
}

var list_test=["Tout d'abord, vous êtes client?",'Votre demande concerne?','Plus précisément?','Mais encore?','Plus précisément?','Plus précisément?','Plus précisément?']
var image_entree =["http://www.s-sfr.fr/media/gred-telmobile-maxi.png","http://www.s-sfr.fr/media/gred-box-maxi1.png","http://www.s-sfr.fr/media/gred-caddie-maxi.png"]

function callback(json_data,json_results,payload,deep){
  //console.log('callback',Object.keys(json_data));
  if(Object.keys(json_data).indexOf("img_link") >= 0){
    //console.log('arret')
  }
  else{
    //console.log(Object.keys(json_data))
    var i = 0;
    Object.keys(json_data).forEach(function(node){

      generate_node(json_data[node], json_results, payload+'_'+i, deep+1);
      i+=1;

    });
  }
}


///////////// to make the quick_reply in button-controller
function make_chatbot_tree(path='./faq.json'){

    var dir = './scripts';
    var filepath = './scripts/dispatcher.json'

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    };
    if (!fs.existsSync(filepath)){
      fs.openSync(filepath, 'w');
    };

    var json_results ={};

    data = fs.readFileSync(path);

    json_data = JSON.parse(data);
    //console.log(json_data)
    var payload = 0;
    var deep = 0;
    generate_node(json_data, json_results, payload, deep, callback);

    fs.writeFileSync("./scripts/dispatcher.json", JSON.stringify(json_results,null,4));

    }

// function include_tree(path="./scripts/dispatcher.json"){
//   data = fs.readFileSync(path);
//
//   json = JSON.parse(data);
//
//   json['0_0_1_1_0']={}
//   json['0_0_1_1_0']['text']={}
//   json['0_0_1_1_0']['text']['output']= "J'ai bien pris en compte votre problème lié à une carte SIM. Pouvez-vous m'expliquer simplement en une phrase votre problème ?"
//
//   fs.writeFileSync("./scripts/dispatcher.json", JSON.stringify(json,null,4));
// }


make_chatbot_tree();
// include_tree();
