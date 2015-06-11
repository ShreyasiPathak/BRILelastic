//"use strict";
var http = require("http"),
    util = require("util");
var moment=require('moment');
var uuid=require('node-uuid');

module.exports={
 doc_insertion: function (n)
 {
   var id=uuid.v1();
   var doc=[];
   for (var i=0;i<n;i++)
   {
      var wrapped=moment(new Date());
      var newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
      var namestr="abc"+i;
      var uniq=id+i;
      var temp={key: uniq,name: namestr,timestamp: newdate,value: i};
      doc.push(temp);
   }
   return doc;
 },
 now: function ()
 {
    var wrapped=moment(new Date());
    var newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
    return newdate;
 },
 getData: function() 
 {
    var options = {
       hostname: 'localhost',
       port: '9234',
       path: '/estest/get/test/data',
       method: 'GET',
       headers: {
           'Content-Type': 'application/json'
       }
    };
    var elasticsearch = require('es');
    var config = {
     server : {
      host : 'brilelastic1.cern.ch',
      port : 9200
     }
    };
    var option = {
      _index : 'twitter1',
      _type : 'tweet1'
    };
    var es = elasticsearch.createClient(config);
    var req = http.request(options, function(res) 
    {
      res.on('data', function (chunk) 
      {
        var chunkstr = JSON.stringify(JSON.parse(chunk));
        console.log("the data");
        console.log(chunkstr);
        var chunkarr=[];
        chunkarr=JSON.parse(chunk);
        console.log(chunkarr);
        es.bulkIndex(option,chunkarr,function(err,data)
        {
          if(err)
          {
            console.log("Error1:" + err);
          }
        });
      });
    });

    req.on('error', function(e) 
    {
      console.log('problem with request: ' + e.message);
    });
    req.end();
 }
};
