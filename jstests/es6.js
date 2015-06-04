var elasticsearch = require('es');
var moment=require('moment');
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
for (var i=1;i<=20;i++)
{
   var wrapped=moment(new Date());
   var newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
   var namestr="abc"+i;
   var doc={key: i,name: namestr,timestamp: newdate};
   es.index(option,doc,function(err,data)
   {
       if(err)
       {
           console.log("Error1:" + err);
       }
   });
}
