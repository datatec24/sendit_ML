
var request = require('request');
var test2Ctrl = require('./test2');

console.log(test2Ctrl);

function numero2(a,b){
  return a + numero5(b);
}

function numero1(a,b){
  var c = test2Ctrl.numero3(6,6,numero2);
  return c;
}

function numero5(b){
  return b*(b+1);
}



//console.log(test2Ctrl.numero3)
//test2Ctrl.numero3(6,6);
console.log(numero1(2,3));

var exports = module.exports ={};

exports.numero2 = numero2;
