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
es = elasticsearch.createClient(config);
es.search(options,
 {
    size : 5,
    _source : {
        include : ["key", "timestamp"]
    },
    query : {
      match_all : {}
    },
    sort : {
      timestamp : {
         order : "asc"
      }
    }
 }, 
 function(err,data) 
 {
     if(err)
     {
        console.log("error1:"+err);
     }
     else
     {
        var jsonstr=JSON.stringify(data,null,2)
        console.log("data"+jsonstr);
     }
 }
);
      
