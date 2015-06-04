var elasticsearch = require('es');
var config = {
     server : {
      host : 'brilelastic1.cern.ch',
      port : 9200
    }
};
var options = {
     _index : "twitter1",
     _type : "tweet1"
};
var data = {};  
es = elasticsearch.createClient(config);
es.indices.createIndex(options,data,function(err,data){
     if(err)
     {
        console.log("error: " +err)
     }
});

