var elasticsearch = require('es');
var  config = {
    _index : 'flashlist',
    _type : 'dipanalyzer',
    server : {
      host : 'brilelastic1.cern.ch',
      port : 9200
    }
};
es = elasticsearch.createClient(config);
es.indices.createIndex(function(err,data){
   if(err)
   {
      console.log("error: " +err)
   }
});
