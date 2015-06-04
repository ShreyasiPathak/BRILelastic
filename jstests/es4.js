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
es = elasticsearch.createClient(config);
/*es.indices.createIndex(function(err,data){
   if(err)
   {
      console.log("Error1: " +err)
   }
});*/
var fs =require('fs');
fs.readFile('filefor_es4', function(err,strobj)
{
  if(err)
  {
     console.log("Error2:" + err);
     return;
  }
  var jsonobj=JSON.parse(strobj);
  console.log(jsonobj)
  es.indices.putMapping(option,jsonobj,function(err,data){
     if(err)
     {
        console.log("Error3: " +err)
     }
  });
});
