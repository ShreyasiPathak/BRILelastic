var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'brilelastic1.cern.ch:9200',
  log: 'trace'
});
var fs =require('fs');
fs.readFile('/home/shreyasi/mapping_get', function(err,strobj)
{
  if(err)
  {
     console.log("Error:" + err);
     return;
  }
  var jsonobj=JSON.parse(strobj);
  client.indices.getMapping(jsonobj, function(err,data1)
  {
     if(err)
     {
         console.log("error in indexing: " +err);
     }
  });
  //console.log(jsontext.mappings);
  //console.log(jsontext.mappings.hostInfo);
});


