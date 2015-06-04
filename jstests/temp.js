var moment=require('moment');
var wrapped=moment(new Date());
//console.log(wrapped);
//var date=wrapped.toDate();
//console.log(date);
newdate=wrapped.format("YYYY-MM-DDTHH:mm:ss");
console.log(newdate);
