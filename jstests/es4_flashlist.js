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
es = elasticsearch.createClient(config);
var fs =require('fs');
fs.readFile("../mapping/mapping_flashlist_dipanalyzer", function(err,strobj)
{
  if(err)
  {
     console.log("Error2:" + err);
     return;
  }
  var jsonobj=JSON.parse(strobj);
  console.log(jsonobj);
  es.indices.putMapping(option,jsonobj,function(err,data){
     if(err)
     {
        console.log("Error3: " +err)
     }
  });
});
