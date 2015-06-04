var elasticsearch = require('es');
var gen_twit=require('../utils/gen_twitter1');
var doc1=[];
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
doc1=gen_twit.doc_insertion(100);
es.bulkIndex(option,doc1,function(err,data)
{
    if(err)
    {
            console.log("Error1:" + err);
    }
});
