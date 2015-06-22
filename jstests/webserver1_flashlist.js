#!/usr/bin/env node
var u = require("../utils/gen_flashlist");
var u1=require("../utils/flashlist_queryback");
var url=require("url");
console.log(u);
global.now = u.now; // make 'now' accessible in loaded modules
var argv = require("optimist").argv;
var defaultConfigFile = "config.json";
var config;
if( argv.h || argv.help ) 
{
  console.log("\n","Usage:",argv.$0," {options} where options are:\n","         -c,--config <path-to-config-file> (default: '"+defaultConfigFile+"')\n","         -h,--help   ...you're reading it :-)");
  process.exit(0);
}
console.log(now(),"Starting");
var http = require("http"),
    fs   = require("fs"); // used for watching the config file for changes
    var configFile = (argv.config || argv.c || defaultConfigFile),
    logVerbose,
    ConsoleLog = function() 
    {
      var arg='';
      for ( var i in arguments ) { arg += arguments[i] + ' '; }
      console.log(now(),arg);
    };
global.logVerbose = logVerbose = ConsoleLog;
// Read the config file, then watch it for changes
var readConfig = function() 
{
  var contents = fs.readFileSync(configFile);
  ConsoleLog("Config file ",configFile," read");
  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose )
  {
    logVerbose = ConsoleLog;
  }
  else
  {
    logVerbose = function() {};
  }
  ConsoleLog("Config: Host and port: ", config.host, ":", config.port);
  ConsoleLog("Config: Verbosity: ", config.verbose);
  ConsoleLog("Config: Logfile: ", config.logfile);
  global.config = config;
};
readConfig();
fs.watchFile(configFile, function() 
{
  ConsoleLog("Config changed");
  readConfig();
});
var obj1;
var jsonquery=[];
// create the server!
var server = http.createServer( function(request,response)
{
  
  ConsoleLog("Received request: " + request.url);
  var obj=url.parse(request.url,true);
  console.log(obj.pathname);
  if (request.url=== "/estest/get/test/data") 
  {
    ConsoleLog("Sending test data");
    response.writeHead(200,{"Content-type":  "application/json","Cache-control": "max-age=0"});
    var doc1={};
    //console.log("calling doc_insertion");
    doc1=u.doc_insertion();
    //console.log("doc1:"+JSON.stringify(doc1));
    response.end(JSON.stringify(doc1));
    return;
  }
  if ( request.url === "/estest/startpolling" ) 
  {
    ConsoleLog("Got a request to start timer...");
    response.writeHead(200,{"Content-type":"text/plain"});
    obj1=setInterval(u.getData,2000);
    response.end("Starting timer");
    return;
  }       
  if ( request.url === "/estest/stoppolling" ) 
  {
    ConsoleLog("Got a request to stop timer...");
    response.writeHead(200,{"Content-type":"text/plain"});
    console.log("timer stopped");
    clearInterval(obj1);
    response.end("Stopping timer");
    return;        
  }
  if ( request.url === "/quit" ) 
  {
    ConsoleLog("Got a request to quit: Outta here...");
    response.writeHead(200,{"Content-type":"text/plain"});
    response.end("Server exiting at your request");
    server.close();
    process.exit(0);
  }
  if (obj.pathname=="/_search")
  {
    console.log("this is before query back");
    u1.query_back(obj,response);
    console.log("this is after query back");
    //console.log(jsonquery[0]);
    return;
  }
// Redirect a request for '/' to the main application HTML file.
// This then falls-through to the rest of the application
  var file = request.url;
  file = file.split('?')[0];
  if ( file === "/" ) 
  {
    logVerbose(now(),"Got a request for /");
    file = "/index.html";
  }
  fs.readFile("./app" + file,function(error,data)
  {
    if ( error )
    {
      //Send a 404 for non-existent files
      ConsoleLog("Error reading ./app"+file+": "+error);
      response.writeHead(404,{"Content-type":"text/plain"});
      response.end("Sorry, page not found<br>");
      return;
    }
    // The file was modified - or the client didn't send an if-modified-since header.
    // So, send the file!
    var type;
    if      ( file.match(/.html$/) ) { type = "text/html"; }
    else if ( file.match(/.css$/) )  { type = "text/css"; }
    else if ( file.match(/.js$/) )   { type = "application/javascript"; }
    else if ( file.match(/.png$/) )  { type = "application/png"; }
    else if ( file.match(/.ico$/) )  { type = "image/x-icon"; }
    else if ( file.match(/.eot$/) )  { type = "application/vnd.ms-fontobject"; }
    else if ( file.match(/.map$/) )  { type = "application/json"; } // or application/octet-stream
    else if ( file.match(/.svg$/) )  { type = "image/svg+xml"; }
    else if ( file.match(/.ttf$/) )  { type = "font/ttf"; }
    else if ( file.match(/.woff$/) ) { type = "font/x-woff"; }
    response.end(data);
  });
}); //http.createServer
// Fire up the server!
server.listen(config.port,config.host,function() {
  ConsoleLog("Listening on " + config.host + ":" + config.port);
});