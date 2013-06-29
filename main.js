var factory = require('./ga-factory.js');

module.exports = function() {
  require('./data-loader.js').loadData('GOOG', function(err, vals) {

  var trainingSet = [4.5, 3.3, 5, 4.6, 5.7, 5.4]; //vals.map(function(v) { return parseFloat(v.Close); }); //[4.5, 3.3, 5, 4.6, 5.7, 5.4];
  var sourceData = [];
  
  var coefAbs = trainingSet
    .map(function(x) { return Math.abs(x); })
    .reduce(function(a, b) { return a > b ? a : b; });

  var gen = factory.newGeneration(Number.MAX_VALUE, 2, 10000);
  var best = gen.getBest(sourceData, trainingSet);
  console.log(-1, best[0].toString(), best[1]);
  
  for (var i = 0; i < 1000; i++) {
    gen = factory.mutateGeneration(gen, sourceData, trainingSet);
    best = gen.getBest(sourceData, trainingSet);
    console.log(i, best[0].toString(), best[1]);
  }
});
};

if (require.main && require.main.filename == __filename) {
  module.exports();
}
