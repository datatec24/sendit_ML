// automating node creation with postback (decision trees with multiple choices)
// Créer automatiquement la réponse à donner après avoir cliqué sur un bouton ou generic qui generer un postback et payload

var config = require('./config');
var fs = require('fs');

function addslashes(ch) {
    // ch = ch.replace(/\'/g,"\\'");
    // ch = ch.replace(/\"/g,"\\\"");
    ch = ch.replace(/\\n/g,"\n");
    return ch;
}


function button_read_here_begin(title, output, payload, json_results){

    json_results[payload]={};
    json_results[payload].text={};
    json_results[payload].text.output=title.text;
    json_results[payload].button={};
    json_results[payload].button.output={};
    json_results[payload].button.output.text= addslashes(output.text);
    json_results[payload].button.output.proposals = [];
    json_results[payload].button.output.proposals[0] = {};
    json_results[payload].button.output.proposals[0].type="postback";
    json_results[payload].button.output.proposals[0].title="Page suivante";
    json_results[payload].button.output.proposals[0].payload=payload+'#';
    if(output.link) {
        json_results[payload].generic = {};
        json_results[payload].generic.output = {};
        json_results[payload].generic.output.proposals = [];
        for (var i = 0 ; i < output.link.length; i++){
            json_results[payload].generic.output.proposals[i] = {};
            json_results[payload].generic.output.proposals[i].title = addslashes(output.button[i]);
            json_results[payload].generic.output.proposals[i].buttons = [];
            json_results[payload].generic.output.proposals[i].buttons[0] = {};
            json_results[payload].generic.output.proposals[i].buttons[0].type = "web_url";
            json_results[payload].generic.output.proposals[i].buttons[0].title = "Lire sur le web";
            json_results[payload].generic.output.proposals[i].buttons[0].url = output.link[i];
        }
    }
    var b = {};
    b.type = "postback";
    b.title = "Arrêter";
    b.payload = "stop";
    json_results[payload].button.output.proposals.push(b);
    if(output.img){
      data = fs.readFileSync('./img2newimg.json');
      data = JSON.parse(data);

      json_results[payload].image={};
      json_results[payload].image.output=[];
      output.img.forEach(function(img){
          if (img in data){
              json_results[payload].image.output.push(data[img]);
          }
          else{
              console.log("error for image:", img);
          }
      });
    }
    return json_results;
}



    // var code = '';
    // code += 'else if (payload == "' + payload + '") {\n';
    // code += '   sendCallback("text", "' + title.text + '", senderId);\n';
    // code += '   output = {};\n';
    // code += '   output.text = "' + addslashes(output.text) + '";\n';
    // code += '   output.proposals = [';
    // code += '\n       {"type":"postback",\n';
    // code += '       "title":"Page suivante",\n';
    // code += '       "payload":"' + payload + '#' + '"}';
    // if(output.link){
    //     for (var i in output.link){
    //         code += ',';
    //         code += '\n       {"type":"web_url",\n';
    //         code += '       "title":"'+ addslashes(output.button[i]) + '",\n';
    //         code += '       "url":"' + output.link[i] + '"}';
    //     }
    // }
    // code += ',\n'
    // code += '       {"type":"postback",\n'
    // code += '       "title":"STOP",\n'
    // code += '       "payload":"stop"}'
    // code += '\n   ];\n';
    // code += '   sendCallback("button", output, senderId);\n';
    // if(output.img){
    //     output.img.forEach(function(img){
    //         code += '   sendCallback("image", "' + img + '", senderId);\n';
    //     });
    // }
    // code += '}';


function button_read_here(output, payload,json_results){

  json_results[payload]={};
  json_results[payload].button={};
  json_results[payload].button.output={};
  json_results[payload].button.output.text= addslashes(output.text);
  json_results[payload].button.output.proposals= [];
  json_results[payload].button.output.proposals[0]={};
  json_results[payload].button.output.proposals[0].type="postback";
  json_results[payload].button.output.proposals[0].title="Page suivante";
  json_results[payload].button.output.proposals[0].payload=payload+'#';
  if(output.link) {
      json_results[payload].generic = {};
      json_results[payload].generic.output = {};
      json_results[payload].generic.output.proposals = [];
      for (var i = 0 ; i < output.link.length; i++){
          json_results[payload].generic.output.proposals[i] = {};
          json_results[payload].generic.output.proposals[i].title = addslashes(output.button[i]);
          json_results[payload].generic.output.proposals[i].buttons = [];
          json_results[payload].generic.output.proposals[i].buttons[0] = {};
          json_results[payload].generic.output.proposals[i].buttons[0].type = "web_url";
          json_results[payload].generic.output.proposals[i].buttons[0].title = "Lire sur le web";
          json_results[payload].generic.output.proposals[i].buttons[0].url = output.link[i];
      }
  }
  var b = {};
  b.type = "postback";
  b.title = "Arrêter";
  b.payload = "stop";
  json_results[payload].button.output.proposals.push(b);
  if(output.img){
    data = fs.readFileSync('./img2newimg.json');
    data = JSON.parse(data);

    json_results[payload].image={};
    json_results[payload].image.output=[];
    output.img.forEach(function(img){
        if (img in data){
            json_results[payload].image.output.push(data[img]);
        }
        else{
            console.log("error for image:", img);
        }
    });
  }
  return json_results;
}

    //
    // var code = '';
    // code += 'else if (payload == "' + payload + '") {\n';
    // code += '   output = {};\n';
    // code += '   output.text = "' + addslashes(output.text) + '";\n';
    // code += '   output.proposals = [';
    // code += '\n       {"type":"postback",\n';
    // code += '       "title":"Page suivante",\n';
    // code += '       "payload":"' + payload + '#' + '"}';
    // if(output.link){
    //     for (var i in output.link){
    //         code += ',';
    //         code += '\n       {"type":"web_url",\n';
    //         code += '       "title":"'+ addslashes(output.button[i]) + '",\n';
    //         code += '       "url":"' + output.link[i] + '"}';
    //     }
    // }
    // code += ',\n'
    // code += '       {"type":"postback",\n'
    // code += '       "title":"STOP",\n'
    // code += '       "payload":"stop"}'
    // code += '\n   ];\n';
    // code += '   sendCallback("button", output, senderId);\n';
    // if(output.img){
    //     output.img.forEach(function(img){
    //         code += '   sendCallback("image", "' + img + '", senderId);\n';
    //     });
    // }
    // code += '}';


function button_read_here_end(output, payload,json_results){

    json_results[payload]={};
    json_results[payload].button={};
    json_results[payload].button.output={};
    json_results[payload].button.output.text= addslashes(output.text);
    json_results[payload].button.output.proposals= [];

    if(output.link) {
        json_results[payload].generic = {};
        json_results[payload].generic.output = {};
        json_results[payload].generic.output.proposals = [];
        for (var i = 0 ; i < output.link.length; i++){
            json_results[payload].generic.output.proposals[i] = {};
            json_results[payload].generic.output.proposals[i].title = addslashes(output.button[i]);
            json_results[payload].generic.output.proposals[i].buttons = [];
            json_results[payload].generic.output.proposals[i].buttons[0] = {};
            json_results[payload].generic.output.proposals[i].buttons[0].type = "web_url";
            json_results[payload].generic.output.proposals[i].buttons[0].title = "Lire sur le web";
            json_results[payload].generic.output.proposals[i].buttons[0].url = output.link[i];
        }
    }
    var b = {};
    b.type = "postback";
    b.title = "Arrêter";
    b.payload = "stop";
    json_results[payload].button.output.proposals.push(b);
    if(output.img){
      data = fs.readFileSync('./img2newimg.json');
      data = JSON.parse(data);

      json_results[payload].image={};
      json_results[payload].image.output=[];
      output.img.forEach(function(img){
          if (img in data){
              json_results[payload].image.output.push(data[img]);
          }
          else{
              console.log("error for image:", img);
          }
      });
    }
    return json_results;
}

//     var code = '';
//     code += 'else if (payload == "' + payload + '") {\n';
//         code += '   output = {};\n';
//         code += '   output.text = "' + addslashes(output.text) + '";\n';
//         code += '   output.proposals = [';
//         if(output.link){
//           for (var i in output.link){
//               if(i !== 0){
//                   code += ',';
//               }
//               code += '\n       {"type":"web_url",\n';
//               code += '       "title":"'+ addslashes(output.button[i]) + '",\n';
//               code += '       "url":"' + output.link[i] + '"}';
//               code += ',\n'
//           }
//         }
//         else{
//
//         }
//     code += '\n       {"type":"postback",\n'
//     code += '       "title":"STOP",\n'
//     code += '       "payload":"stop"}'
//     code += '\n   ];\n';
//     code += '   sendCallback("button", output, senderId);\n';
//     //
//     // else {
//     //     code += '   output = "' + addslashes(output.text) + '";\n';
//     //     code += '   sendCallback("text", output, senderId);\n';
//     // }
//     if(output.img){
//         output.img.forEach(function(img){
//             code += '   sendCallback("image", "' + img + '", senderId);\n';
//         });
//     }
//     code += '}';
// }

//////////////// to make next page button in main controller where there is a postback
function make_read_here(path='./link2answer.json'){
    fs.readFile(path, (err, data) => {

        var dir = './scripts';
        var filepath = './scripts/payback.json';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        if (!fs.existsSync(filepath)){
            fs.openSync(filepath, 'w');
        }

        var json_results = {};

        var json_data = JSON.parse(data);

        newlink = fs.readFileSync('./link2newlink.json');
        newlink = JSON.parse(data);

        Object.keys(json_data).forEach(function(link){
            for (var j in json_data[link]){
              //console.log('j',typeof(j))

                if(j == 0){
                    // do nothing, title will be send at j == 1
                    continue;
                }
                else if (j == 1){
                    payload = link + '#'.repeat(j-1);
                    json_results = button_read_here_begin(json_data[link][j-1], json_data[link][j], payload, json_results);
                }
                else if(json_data[link][String(parseInt(j)+1)]){
                    //console.log(j,String(parseInt(j)+1))
                    payload = link + '#'.repeat(j-1);
                    json_results = button_read_here(json_data[link][j], payload, json_results);
                }
                else{
                    payload = link + '#'.repeat(j-1);
                    json_results = button_read_here_end(json_data[link][j], payload, json_results);
                }
            }
        });
        fs.writeFileSync("./scripts/payback.json", JSON.stringify(json_results,null,4),'utf8');
    });
}


make_read_here();
