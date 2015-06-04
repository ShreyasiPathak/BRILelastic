var fs =require('fs');
module.exports.mapping=function (option,file_name,es)
{
   file_name='../mapping/'+file_name;
   fs.readFile(file_name, function(err,strobj)
   {
      if(err)
      {
        console.log("Error2:" + err);
        return;
      }
      var jsonobj=JSON.parse(strobj);
      es.indices.putMapping(option,jsonobj,function(err,data)
      {
        if(err)
        {
          console.log("Error3: " +err)
        }
      });
   });
};
