var elasticsearch = require('es');
var  config = {
    _index : 'twitter1',
    _type : 'tweet1',
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
/*es.search({
    query : {
      field : {
        animal : 'kitteh'
      }
    }
  }, function (err, data) {
    // work with data here
    // response data is according to ElasticSearch spec
  });*/
