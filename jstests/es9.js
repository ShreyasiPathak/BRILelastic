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
   query : {
      filtered : {
            size : 5,
           _source : {
               include : ["key", "timestamp"]
           },
           sort : {
             timestamp : {
                order : "asc"
             }
           },
           query : {
              match_all : {}
           },
          
           filter : {
              bool : {
                  must : [
                      {
                         range : {
                            timestamp : {
                               gte : "2015-06-11T15:41:47",
                               lte : "2015-06-11T15:41:49"
                            }
                         }
                       },
                       {
                          term : {
                             name : "abc1" 
                           }
                        }
                   ]
              }
           }
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
      
