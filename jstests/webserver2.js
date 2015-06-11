var http = require("http");
var url=require("url");
function func()
{
    console.log("this is timer");
}
var server = http.createServer(function (request, response) {
    console.log('request starting...');
    // respond
    response.write('hello client!');
    var obj=url.parse(request.url);
    if(obj.pathname== "/estest")
    {
       var obj=setInterval(func,2000);
    }
    else
    {
       clearInterval(obj);
    }    
    response.end();
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
