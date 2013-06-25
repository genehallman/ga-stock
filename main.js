var factory = require('./ga-factory.js');

module.exports = function() {
  var trainingSet = [4.5, 3.3, 5, 4.6, 5.7, 5.4];
  var sourceData = [];
  
  var coefAbs = trainingSet
    .map(function(x) { return Math.abs(x); })
    .reduce(function(a, b) { return a > b ? a : b; });

  var gen = factory.newGeneration(coefAbs * 2, 2, 10);
  var best = gen.getBest(sourceData, trainingSet);
  console.log(best[0].toString(), best[1]);
  
  for (var i = 0; i < 10; i++) {
    gen = factory.mutateGeneration(gen, sourceData, trainingSet);
    best = gen.getBest(sourceData, trainingSet);
    console.log(best[0].toString(), best[1]);
  }
};
