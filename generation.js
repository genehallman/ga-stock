var Algorithm = require('./algorithm.js');
var factory = require('./ga-factory.js');

var Generation = function() {
  this.algorithms = [];
  this.best = null;
};

Generation.prototype.getBest = function(sourceData, trainingSet) {
  if (!this.best) {
    this.best = this.algorithms.map(function(a) { 
      return [a, factory.evalFitness(a, sourceData, trainingSet) || Number.MAX_VALUE];
    }).reduce(function(a, b) {
      return a[1] < b[1] ? a : b;
    });
  }
  return this.best;
};

module.exports = Generation;
