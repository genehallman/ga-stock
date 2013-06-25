var Component = require('./component.js');

var Algorithm = function(bitStr) {
  this.components = [];
  if (bitStr) {
    var compLen = Math.ceil(bitStr.length/48);
    for (var i = 0; i < compLen; i++) {
      this.components.push(new Component(bitStr.substr(i*48, 48)));
    }
  }
};

Algorithm.prototype.eval = function(set, i) {
  var total = 0;
  for (var j = 0; j < this.components.length; j++) {
    var res = this.components[j].eval(set, i);
    total = total + res;
  }
  return total;
};

Algorithm.prototype.toString = function() {
  return this.components.map(function(c) { return c.toString() }).join(" + ");
};

Algorithm.prototype.toBitString = function() {
  return this.components.map(function(c) { return c.toBitString() }).join("");
};

module.exports = Algorithm;