var Algorithm = require('./algorithm.js');
var Component = require('./component.js');
var Generation = require('./generation.js');
var baseFns = require('./base_functions.js');
var argFns = require('./arg_functions.js');

exports.newComponent = function(coefAbs) {
  var baseKeys = Object.keys(baseFns);
  var baseFn = baseKeys[Math.floor(Math.random() * baseKeys.length)];
  var argKeys = Object.keys(argFns);
  var argFn = argKeys[Math.floor(Math.random() * argKeys.length)];
  var coefficient = (Math.random() * coefAbs * 2) - coefAbs;
  return new Component(coefficient, baseFn, argFn);
};

exports.newAlgorithm = function(coefAbs, compCount) {
  var algo = new Algorithm();
  for (var i = 0; i < compCount; i++) {
    var comp = exports.newComponent(coefAbs);
    algo.components.push(comp);
  }
  return algo;
};

exports.evalFitness = function(algorithm, sourceData, trainingSet) {
  var totalDiff = 0;
  for (var i = 0; i < trainingSet.length; i++) {
    var res = algorithm.eval(sourceData, i);
    console.log(res, trainingSet[i]);
    var diff = Math.abs(trainingSet[i] - res);
    totalDiff = totalDiff + diff;
  }
  return totalDiff;
};

exports.crossover = function(male, female) {
  var points = [];
  for (var i = 0; i < 10; i++) {
    points[i] = Math.floor(Math.random() * male.length);
  }
  points = points.sort(function(a, b) { return a-b; });

  var childStr = "";
  var cur, start;
  for (var i = 0; i < 10; i++) {
    cur = i % 2 == 0 ? male : female;
    start = i == 0 ? 0 : points[i-1];
    
    childStr = childStr + cur.substr(start, points[i] - start);
  }
  childStr = childStr + male.substr(points[9]);
  if (childStr == male || childStr == female) {
    console.log("DUPE");
  }
  return new Algorithm(childStr);
};

exports.newGeneration = function(coefAbs, compCount, algoCount) {
  var gen = new Generation();
  for (var i = 0; i < algoCount; i++) {
    var algo = exports.newAlgorithm(coefAbs, compCount);
    gen.algorithms.push(algo);
  }
  return gen;
};

exports.mutateGeneration = function(gen, sourceData, trainingSet) {
  var fitness = gen.algorithms.map(function(a) { return exports.evalFitness(a, sourceData, trainingSet); });
  
  var max = fitness.reduce(function(f1, f2) { return f1 > f2 ? f1 : f2; });
  var min = fitness.reduce(function(f1, f2) { return f1 < f2 ? f1 : f2; });

  fitness = fitness.map(function(f) { return (max + min) - f; });
  var total = fitness.reduce(function(f1, f2) { return f1 + f2; });
  var weights = fitness.map(function(f) { return f / total; });

  var newGen = new Generation();
  for (var i = 0; i < gen.algorithms.length; i++) {
    if (i == 0) {
      newGen.algorithms.push(gen.getBest(sourceData, trainingSet)[0]);
      continue;
    }
    var offset1 = Math.random();
    var offset2 = Math.random();
    var index1 = 0;
    var index2 = 0;
    while (offset1 - weights[index1] > 0) {
      offset1 = offset1 - weights[index1];
      index1++;
    }
    while (offset2 - weights[index2] > 0) {
      offset2 = offset2 - weights[index2];
      index2++;
    }
    var algoM = gen.algorithms[index1];
    var algoF = gen.algorithms[index2];
    
    var child = exports.crossover(algoM.toBitString(), algoF.toBitString());
    newGen.algorithms.push(child);
  }
  
  return newGen;
};














