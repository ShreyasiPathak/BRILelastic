"use strict";
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
      var temp={key: uniq,name: namestr,timestamp: newdate};
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
 getData: function(options,request,response,obj) 
 {
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
    console.log(util.inspect(obj));
    var req = http.request(options, function(res) {
      //logVerbose(obj.me,'Status: ' + res.statusCode);
      //logVerbose(obj.me,'Headers: ' + JSON.stringify(res.headers));
      if ( res.statusCode !== 200 ) {
        response.writeHead(res.statusCode,res.headers);
        response.end(response.text);
      }
      res.on('data', function (chunk) 
      {
        var chunkstr = JSON.stringify(JSON.parse(chunk));
        //logVerbose(obj.me,'Body: ' + chunk);
        /*if ( obj.parseData ) 
        {
          logVerbose(obj.me,'Parsing data...');
          var chunkstr = JSON.stringify(JSON.parse(chunk));
        }*/
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
