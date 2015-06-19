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
var jsonstr1=[];
module.exports.query_back= function (obj,response)
{
     console.log("hi hi");
     console.log(obj.pathname);
     var jsonstr=' "query" : { "filtered" : { "query": { "match_all": {}}';
     var jsonstr2='} },"sort" : { "Timestamp" : { "order" : "asc"}}'; 
     if(obj.query.size)
     {
          console.log("I am in obj.query.size");
          jsonstr='"size":'+obj.query.size+","+jsonstr;
     }
     if(obj.query.field)
     {
          console.log(obj.query.field);
          jsonstr='"_source":{ "include" : '+obj.query.field+"},"+jsonstr;
     }    
     if(obj.query.term && !obj.query.range)
     {
          var temp5=[];
          console.log("term:"+obj.query.term);
          temp5=(obj.query.term.toString()).split(":");
          jsonstr=jsonstr+', "filter" : { "term" : {"'+temp5[0]+'" : "'+temp5[1]+'" } }';
     }
     if(obj.query.range && !obj.query.term)
     {
          console.log("Range:"+obj.query.range);
          var temp2=[],temp3=[],temp4=[];
          var temp1=obj.query.range;
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
     if(obj.query.term && obj.query.range)
     {
          console.log("Range:"+obj.query.range);
          var temp2=[],temp3=[],temp4=[],temp5=[];
          var temp1=obj.query.range;
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
          temp5=(obj.query.term.toString()).split(":");
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
                    //var jsonstr=JSON.stringify(data,null,2);
                    //console.log(data);
                    for(var k in data.hits.hits)
                    {
                         //console.log("Checking"+data.hits.hits[k]);
                         var temp=JSON.stringify(data.hits.hits[k]._source,null,2);
                         jsonstr1.push(temp);
                         //response.write(temp);
                    }
                    console.log("k:"+k);
                    //console.log("data"+jsonstr1[0]);
                    //response.end();
               }
          }
     );
     return jsonstr1;
     response.end("string");
};