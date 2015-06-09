//
// This example shows how to handle the bcml data
//
"use strict";
var http = require("http"),
    util = require("./gen_twitter1");

//
// 'me' is used in several places, to define the URL that will serve your data,
// (/get/"me"/data) and in output to the logfile.
//
var me = 'bcml';

//
// The "options" object defines how to contact your data-source. Change the
// hostname/port/path as appropriate.
//
// You can also define the HTTP method and content-type, but these should
// not normally need to be changed.
//
var options = {
  hostname: 'localhost',
  port: '9234',
  path: '/get/test/data',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};
module.exports = {
  me: me,

//
// The 'get' function won't need changing, it's standard
//
  get: function(request,response) {
    if (request.url === "/get/test/data" ) {
      logVerbose(now(),'Get ' + me + ' data from xmas');
      util.getData(options,request,response,this);
    } else {
      console.log(now(),me,": How the heck did I get here???");
    }
  },
  /*requestdata: function()
  {
     console.log("Now it will get fake data...");
     util.getData(options,response,this);
  }*/

//
// The 'parseData' function takes the raw JSON object from xmas and does
// whatever is needed to transform it into something usable by the client
// application. Typically this means making a data-structure which can be
// fed directly to a Highcharts plotting function.
//
// In this case, the data structure contains a date as a string. Parse it
// to an epoch time, which in JavaScript means milliseconds since 01/01/1970.
//
// You could also tidy the values here. E.g. there are a lot of '-1's in the
// PercentAbort1 fake data. You could remove them, or do something else with
// them. It all depends what you want the presentation code to see.
//
// It's also worth pruning away stuff you don't need in the browser. It just
// wastes bandwidth and CPU to encode, send and parse it.
//
  parseData: function(data) {
    for ( var i=0;i<data.length;i++ ) {
      console.log(data[i]);
    }
  },
  path: [ '/get/test/data' ]
};
