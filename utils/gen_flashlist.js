//"use strict";
var http = require("http"),
    util = require("util");
var moment=require('moment');
//var uuid=require('node-uuid');

module.exports={
 doc_insertion: function ()
 {
   console.log("insertion");
   //var id=uuid.v1();
   var arr=[],arr1=[],arr2=[];
   var wrapped=moment(new Date());
   var newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
   var input="http://xdaq.web.cern.ch/xdaq/xsd/2006/xmas-10";
   for (var i=0;i<48;i++)
   {   
      var k=i+0.5;
      var k1=i+0.25;
      var k2=i+0.6;
      arr.push(k);
      arr1.push(k1);
      arr2.push(k2);
   }
   var temp={Context: input,lid: "102",Timestamp: newdate,Percentabort1: arr.slice(),Percentabort12: arr1.slice(),Runningsum9: arr2.slice(),Timelastdump:8};
   return temp;
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
      _index : 'flashlist',
      _type : 'dipanalyzer'
    };
    var es = elasticsearch.createClient(config);
    var totalchunk="";
    var req = http.request(options, function(res) 
    {
      res.on('data', function (chunk) 
      {
        console.log("data event");
        var chunkstr = chunk.toString();
        totalchunk=totalchunk+chunkstr;
        console.log("the data");
        //console.log(chunkstr);
      });
      res.on('end', function()
      {
        var chunkarr={};
        console.log("end event");
        //console.log("total chunk" + totalchunk);
        chunkarr=JSON.parse(totalchunk);
        //console.log(chunkarr);
        es.index(option,chunkarr,function(err,data)
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
