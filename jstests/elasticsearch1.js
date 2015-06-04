var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'brilelastic1.cern.ch:9200',
  log: 'trace'
});
client.indices.create({
     index : "twitter1",
     type : "tweet1"
   },
   function(err,data){
       if(err)
       {
          console.log("Error1: " +err);
       }
   }
);
client.create(
 {
  index: 'twitter1',
  type: 'tweet1',
  id: '1',
  body: {
    key : '1',
    name : 'shreyasi',
    timestamp: '2015-06-03T15:19:10'
  }
 }, 
 function (err, data) 
 {
       if(err)
       {
            console.log("error" + err);
       }
 }
);
