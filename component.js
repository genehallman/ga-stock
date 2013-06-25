var baseFns = require('./base_functions.js');
var argFns = require('./arg_functions.js');

var Component = function(coefficient, fn, arg_fn) {
  if (typeof coefficient == "string") {
    var binStr = coefficient;
    var buff = new Buffer(6);
    buff.fill(0);
    for (var i = 0; i < buff.length; i++) {
      var tInt = parseInt(binStr.substr(i*8, 8), 2);
      buff.writeUInt8(tInt, i);
    }
    this.coefficient = buff.readFloatBE(0);
    this.fn = Object.keys(baseFns)[buff.readUInt8(4)];
    this.arg_fn = Object.keys(argFns)[buff.readUInt8(5)];
  } else {
    this.coefficient = coefficient || 0;
    this.fn = fn || "x";
    this.arg_fn = arg_fn || "x";    
  }
};

Component.prototype.eval = function(set, i) {
  var args = argFns[this.arg_fn](set, i);
  var fn_res = baseFns[this.fn].apply(null, args);
  return fn_res * this.coefficient;
};

Component.prototype.toString = function() {
  return this.coefficient + "." + this.fn + "(" + this.arg_fn + ")";
};

Component.prototype.toBitString = function() {
  // 32 bits BE coeff + 8 bit base fn + 8 bit arg fn = 48 bits
  var buff = new Buffer(6);
  buff.writeFloatBE(this.coefficient, 0);
  buff.writeUInt8(Object.keys(baseFns).indexOf(this.fn), 4);
  buff.writeUInt8(Object.keys(argFns).indexOf(this.arg_fn), 5);
  var binStr = "";
  for (var i = 0; i < buff.length; i++) {
    var tbin = buff[i].toString(2);
    binStr = binStr + "00000000".substr(tbin.length) + tbin;
  }
  return binStr;
};

module.exports = Component;