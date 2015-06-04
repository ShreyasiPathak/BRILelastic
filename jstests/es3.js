var elasticsearch = require('es');
var config = {
     server : {
      host : 'brilelastic1.cern.ch',
      port : 9200
    }
};
var data = {};  
es = elasticsearch.createClient(config);
var fs =require('fs');
fs.readFile('filefor_es3', function(err,strobj)
{
  if(err)
  {
     console.log("Error:" + err);
     return;
  }
  var jsonobj=JSON.parse(strobj);
  console.log(jsonobj)
  es.indices.createIndex(jsonobj,data,function(err,data){
     if(err)
     {
        console.log("error: " +err)
     }
  });
});
