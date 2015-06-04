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
es.indices.mappings(option,function(err,data){ //this is used to get the mapping of the _index & _type provided
     if(err)
     {
        console.log("Error1: " +err);
     }
     var jsonstr=JSON.stringify(data,null,2); //spacing level=2. Prints in pretty format
     console.log("mapping:" + jsonstr);
});
