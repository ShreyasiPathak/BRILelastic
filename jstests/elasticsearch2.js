var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'brilelastic1.cern.ch:9200/twitter1',
  log: 'trace'
});
var fs =require('fs');
fs.readFile('filefor_elasticsearch2', function(err,strobj)
{
  if(err)
  {
     console.log("Error2:" + err);
     return;
  }
  var jsonobj=JSON.parse(strobj);
  client.indices.putMapping(jsonobj, function(err,data1)
  {
     if(err)
     {
         console.log("Error3: " +err);
     }
  });
});
