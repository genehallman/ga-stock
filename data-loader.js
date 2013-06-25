var request = require('request');
var moment = require('moment');
var csv = require('csv');

exports.loadData = function(symbol, end_date, start_date, callback) {
  // format dates as "Jun 24, 2012"
  if (typeof end_date == "function") {
    callback = end_date;
    end_date = undefined;
  } else if (typeof start_date == "function") {
    callback = start_date;
    start_date = undefined;
  }
  console.log(end_date);
  end_date = moment(end_date);
  console.log(end_date);
  start_date = moment(start_date || moment(end_date).subtract('years', 1));


  var uri = [
    "http://www.google.com/finance/historical?q=",
    symbol,
    "&startdate=",
    encodeURIComponent(start_date.format("MMM D, YYYY")),
    "&enddate=",
    encodeURIComponent(end_date.format("MMM D, YYYY")),
    "&output=csv"
  ].join("");
  
  request(uri, function(err, resp, body) {
    csv().from(body, {
      columns: true
    }).to.array(function(data, count) {
      if (callback) {
        callback(null, data.reverse());
      }
    });
  });
}
