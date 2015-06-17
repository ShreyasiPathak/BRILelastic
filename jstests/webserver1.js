#!/usr/bin/env node
//"use strict";
var u = require("../utils/gen_twitter1");
var url=require("url");
var timerid;
console.log(u);
global.now = u.now; // make 'now' accessible in loaded modules

var argv = require("optimist").argv;
var defaultConfigFile = "config.json";
var config;

if ( argv.h || argv.help ) 
{
  console.log("\n",
  "Usage:",argv.$0," {options} where options are:\n",
  "         -c,--config <path-to-config-file> (default: '"+defaultConfigFile+"')\n",
  "         -h,--help   ...you're reading it :-)"
  );
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
//
// Read the config file, then watch it for changes
//
var readConfig = function() 
{
  var contents = fs.readFileSync(configFile);
  ConsoleLog("Config file ",configFile," read");
  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose ) {
    logVerbose = ConsoleLog;
  } else {
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
// create the server!
var server = http.createServer( function(request,response)
{
  
  ConsoleLog("Received request: " + request.url);
  var obj=url.parse(request.url);
  console.log(obj.pathname);
  if (request.url=== "/estest/get/test/data") 
  {
          ConsoleLog("Sending test data");
    	  response.writeHead(200,{
        	"Content-type":  "application/json",
        	"Cache-control": "max-age=0"
      	  });
    	  var doc1=[];
    	  doc1=u.doc_insertion(5);
    	  response.end(JSON.stringify(doc1));
    	  return;
  }
  if ( request.url === "/estest/startpolling" ) 
  {
          ConsoleLog("Got a request to start timer...");
          response.writeHead(200,{"Content-type":"text/plain"});
          response.end("Starting timer");
          obj1=setInterval(u.getData,2000);
  }       
  if ( request.url === "/estest/stoppolling" ) 
  {
          ConsoleLog("Got a request to stop timer...");
          response.writeHead(200,{"Content-type":"text/plain"});
          response.end("Stopping timer");
          clearInterval(obj1);
  }
  if ( request.url === "/quit" ) 
  {
          ConsoleLog("Got a request to quit: Outta here...");
          response.writeHead(200,{"Content-type":"text/plain"});
          response.end("Server exiting at your request");
          server.close();
          process.exit(0);
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
  //
// This part serves the app directory, taking care of file-type and caching
// properties for html, javascript, css and image files.
//
// It also handles non-existent files and if-modified-since headers.
//
  var imstime, mtime = new Date(fs.statSync("./app"+file).mtime);
  fs.readFile("./app" + file,function(error,data) {
    if ( error ) {
//    Send a 404 for non-existent files
      ConsoleLog("Error reading ./app"+file+": "+error);
      response.writeHead(404,{"Content-type":"text/plain"});
      response.end("Sorry, page not found<br>");
      return;
    }
//
//  The file exists, so deal with if-modified-since header, if given by the client
//
    if ( request.headers["if-modified-since"] ) {
      imstime = new Date(request.headers["if-modified-since"]).getTime();
      if ( mtime ) { mtime = mtime.getTime(); }
      else         { mtime = 9999999999; }
      if ( imstime >= mtime ) {
        logVerbose(now(),"Not modified: ./app"+file);
        response.writeHead(304);
        response.end();
        return;
      }
    }
//
// The file was modified - or the client didn't send an if-modified-since header.
// So, send the file!
//
    logVerbose(now(),"Sending ./app"+file);
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

    if ( !type ) { console.log("No Content-type for ",file); process.exit(0); }
    response.setHeader("Content-type",  type);
    response.setHeader("Cache-control", "max-age=3600");
    if ( !mtime ) { console.log("No mtime for ",file); process.exit(0); }
    response.setHeader("Last-modified", mtime);
    response.writeHead(200);
    response.end(data);
  });
}); //http.createServer
// Fire up the server!
server.listen(config.port,config.host,function() {
  ConsoleLog("Listening on " + config.host + ":" + config.port);
});
