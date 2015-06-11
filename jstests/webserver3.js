var http = require("http");
var url=require("url");
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
var es = elasticsearch.createClient(config);
var server = http.createServer(function(request, response) 
{
    console.log('request starting...');
    var obj1=url.parse(request.url,true);
    var jsonstr1=[];
    if(obj1.pathname=="/_search")
    {
       console.log(obj1.pathname);
       var jsonstr=' "query": { "match_all": {}}, "sort" : { "timestamp" : { "order" : "asc"}}'; 
       /*var jsonobj={
               query: { 
                 match_all: {}
               },
               sort : {
                 timestamp : {
                    order : "desc"
                 }
               }
       };*/
       if(obj1.query.size)
       {
           jsonstr='"size":'+obj1.query.size+","+jsonstr;
           //console.log("jsonstr:"+jsonstr);
       }
       if(obj1.query.field)
       {
           console.log(obj1.query.field);
           jsonstr='"_source":{ "include" : '+obj1.query.field+"},"+jsonstr;
           //console.log("jsonstr:"+jsonstr);
       }
       jsonstr="{"+jsonstr+"}";
       var jsonobj=JSON.parse(jsonstr);
       console.log(jsonobj);
       es.search(options,jsonobj,
          function(err,data) 
          {
             if(err)
             {
                console.log("error1:"+err);
             }
             else
             {
                var jsonstr=JSON.stringify(data,null,2);
                for(var j=0;j<obj1.query.size;j++)
                {
                   var temp=JSON.stringify(data.hits.hits[j]._source,null,2);
                   jsonstr1.push(temp);
                   response.write(temp);
                }
                console.log("data"+jsonstr1);
                response.end();
             }
          }
       );
    }
   
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
