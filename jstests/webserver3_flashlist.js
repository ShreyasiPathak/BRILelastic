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
     _index : "flashlist",
     _type : "dipanalyzer"
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
       var jsonstr=' "query" : { "filtered" : { "query": { "match_all": {}}';
       var jsonstr2='} },"sort" : { "Timestamp" : { "order" : "asc"}}'; 
       if(obj1.query.size)
       {
           jsonstr='"size":'+obj1.query.size+","+jsonstr;
       }
       if(obj1.query.field)
       {
           console.log(obj1.query.field);
           jsonstr='"_source":{ "include" : '+obj1.query.field+"},"+jsonstr;
       }
       if(obj1.query.term && !obj1.query.range)
       {
           var temp5=[];
           console.log("term:"+obj1.query.term);
           temp5=(obj1.query.term.toString()).split(":");
           jsonstr=jsonstr+', "filter" : { "term" : {"'+temp5[0]+'" : "'+temp5[1]+'" } }';
       }
       if(obj1.query.range && !obj1.query.term)
       {
           console.log("Range:"+obj1.query.range);
           var temp2=[],temp3=[],temp4=[];
           var temp1=obj1.query.range;
           var tempstr=temp1.toString();
           temp2=tempstr.split(",");
           for(var i=0;i<temp2.length;i++)
           {
              temp3=(temp2[i].toString()).split(".");
              temp4.push(temp3);
           }
           for(var i=0;i<temp4.length;i++)
           {
             for(var j=0;j<temp3.length;j++)
             {
               console.log(temp4[i][j]);
             }
           }
           
           jsonstr=jsonstr+', "filter" : { "range" :{"'+temp4[0][0]+'" : { "'+temp4[0][1]+'" : "'+temp4[0][2]+'", "'+temp4[1][1]+'" : "'+temp4[1][2]+'" } } }';
           
       }
       if(obj1.query.term && obj1.query.range)
       {
           console.log("Range:"+obj1.query.range);
           var temp2=[],temp3=[],temp4=[],temp5=[];
           var temp1=obj1.query.range;
           var tempstr=temp1.toString();
           temp2=tempstr.split(",");
           for(var i=0;i<temp2.length;i++)
           {
              temp3=(temp2[i].toString()).split(".");
              temp4.push(temp3);
           }
           for(var i=0;i<temp4.length;i++)
           {
             for(var j=0;j<temp3.length;j++)
             {
               console.log(temp4[i][j]);
             }
           }
           temp5=(obj1.query.term.toString()).split(":");
           jsonstr=jsonstr+', "filter" : { "bool" : { "must" : [ { "range" : {"'+temp4[0][0]+'" : { "'+temp4[0][1]+'" : "'+temp4[0][2]+'", "'+temp4[1][1]+'" : "'+temp4[1][2]+'" } } }, { "term" : {"'+temp5[0]+'" : "'+temp5[1]+'" } } ] } }';
       }
       jsonstr=jsonstr+jsonstr2;
       jsonstr="{"+jsonstr+"}";
       var jsonobj=JSON.parse(jsonstr);
       console.log(jsonobj);
       var k=0;
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
                console.log(data);
                for(var k in data.hits.hits)
                {
                   console.log("Checking"+data.hits.hits[k]);
                   var temp=JSON.stringify(data.hits.hits[k]._source,null,2);
                   jsonstr1.push(temp);
                   response.write(temp);
                }
                console.log("k:"+k);
                console.log("data"+jsonstr1);
                response.end();
             }
          }
       );
    }
   
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
