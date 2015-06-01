var fs =require('fs');
fs.readFile('/home/shreyasi/mapping_flashlist', function(err,data)
{
  if(err)
  {
     console.log("Error:" + err);
     return;
  }
  var jsontext=JSON.parse(data);
  console.log(jsontext);
  console.log(jsontext.mappings);
  console.log(jsontext.mappings.hostInfo);
});
