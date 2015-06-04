var moment=require('moment');
module.exports.doc_insertion=function (n)
{
   var doc=[];
   for (var i=0;i<n;i++)
   {
      var wrapped=moment(new Date());
      var newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
      var namestr="abc"+i;
      var temp={key: i,name: namestr,timestamp: newdate};
      doc.push(temp);
   }
   return doc;
};
