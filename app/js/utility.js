// some global variables, tsk tsk...
"use strict";
var views = []; // an array of view-handlers, each view registers here when it's loaded

var timers = [], // global array of timers, so I can cancel them all on page-switch
    baseUrl = document.location.protocol + "//" + document.location.hostname;
if ( document.location.port ) { baseUrl += ":" + document.location.port; }

var getFormattedDate = function(date) {
// helper function, formats the date for human readability
  if ( !date ) { date = new Date(); }
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return str;
};

var setFadeMessage = function(el, message, bgclass, button, timeout) {
// helper function: set a message banner with a background colour.
// Leave it visible for a while, then fade it out over a longer time.
// Re-enable an associated button, if required
  $(el).stop()              // stop any previous animation
       .css('opacity', 1.0)  // make the status window visible in case it wasn't
       .text(message)
       .removeClass( 'bg-success bg-info bg-warning bg-danger' )       // remove any colour classes
       .addClass(bgclass);  // mark it accordingly

  if ( !timeout ) { timeout = 2000; }
  setTimeout( function() {
    if ( button ) { $(button).prop('disabled', false); }
    $(el).animate(
                    { opacity:0 }, 5000,
                    function() { $(el).removeAttr('disabled'); }
                  );
    }, timeout);
};

var saveJSON = function(filename, data){
// extend the Highcharts export menu with a 'download json' option
  var a = document.createElement('a');
  a.setAttribute('download', filename);
  a.href = 'data:;,' + JSON.stringify(data);
  a.innerHTML = 'ignore...';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

var ajaxFail = function(el, jqXHR, textStatus) {
  setFadeMessage(el, "Ajax call failed: status="+jqXHR.status+" ("+textStatus+")",
               "bg-danger", null, 10000);
};

var activeView; // record which view is active
var setView = function(view) {
// toggle between views
  console.log("switch to view", view);
  var i, v;

// clear all timers running in the current view
  for (i = 0; i < timers.length; i++) { clearTimeout(timers[i]); }

  for ( i=0; i<views.length; i++ ) {
    v = views[i];
    $("#view-"+v.me).button().prop('disabled', ( v.me === view ? true : false ) );
    if ( (v.me === view) || (v.me === activeView) ) { $('.'+v.me).toggle(); }
  }

  // now I need the view object, not just it's name...
  for ( i=0; i<views.length; i++ ) {
    if ( (views[i].me === view) ) { view = views[i]; }
  }

  view.start();
  activeView = view.me;
  console.log("Switched to view", view.me);
};

var now = function(date) {
  if ( !date ) { date = new Date(); }
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":";
  return str;
};

var addView = function(me) {
  var Me = me.charAt(0).toUpperCase() + me.slice(1);
  Me = Me.replace(/_/g, ' ');
  $('<div class="select-view-div">' +
    '  <button type="submit" class="btn btn-primary" id="view-'+me+'">'+Me+'</button>' +
     '</div>').appendTo('#select-views');

// only append if it doesn't exist already!
  if ( $('div#control-panel div.'+me).length === 0 ) {
    $('<div class="'+me+'"></div>').appendTo('#control-panel');
  }

  $('<div class="row '+me+'"><!-- holds the subtitle panel -->' +
    '  <div class="col-md-3"></div>' +
    '  <div class="col-md-6"><div id="'+me+'-subtitle"></div></div>' +
    '  <div class="col-md-3">' +
    '</div> <!-- row '+me+' -->' +

    '<div class="row '+me+'"><!-- holds the buttons for refreshing the '+me+' data -->' +
    '  <div class="col-md-8"></div>' +
    '   <div class="col-md-4">' +
    '    <div class="btn-group" role="group">' +
    '      <button class="btn btn-primary" id="'+me+'_single_refresh" role="button" data-loading-text="Loading...">Single refresh</button>' +
    '      <button class="btn btn-primary" id="'+me+'_auto_refresh" role="button" data-toggle="button" aria-pressed="false" style="margin-left: 4px">Start auto-refresh</button>' +
    '    </div>' +
    '  </div>' +
    '</div>' +
    '<div class="row '+me+'"><!-- this is where the main chart goes -->' +
    '  <div class="col-md-12">' +
    '    <div id="'+me+'-chart" class="chart"></div>' +
    '    <div id="'+me+'-chart-message" class="chart-selected-message"></div>' +
    '    <div id="'+me+'-chart2" class="chart"></div>' +
    '    <div id="'+me+'-chart2-message" class="chart-selected-message"></div>' +
    '    <div id="'+me+'-chart3" class="chart"></div>' +
    '    <div id="'+me+'-chart3-message" class="chart-selected-message"></div>' +
    '    <div id="'+me+'-chart4" class="chart"></div>' +
    '    <div id="'+me+'-chart4-message" class="chart-selected-message"></div>' +
    '  </div>' +
    '</div> <!-- row '+me+' -->').appendTo('#rhs');
};

var setupHandlers = function(obj) {
  var el;

//  handler for the single-refresh button, if present...
  el = $('#'+obj.me+'_single_refresh');
  if ( el ) { // only build handler if the element exists!
    $(el).click(function() {
      obj.activeButton = $(this).button('loading');
      obj.get();
    });
  }

//  handler for the auto-refresh button, if present...
  el = $('#'+obj.me+'_auto_refresh');
  if ( el ) { // only build handler if the element exists!
    obj.autoRefreshOn = false;
    obj.autoRefresh = function() {
      if ( obj.autoRefreshOn ) {
        obj.get();
        timers.push(setTimeout(obj.autoRefresh, 1000));
        $('#'+obj.me+'_single_refresh').button().prop('disabled', true); // don't need this every time, but heck...
      } else {
        return;
      }
    };

    $(el).click(function() {
      if ( obj.autoRefreshOn ) {
        console.log("Stopping auto-refresh");
        $('#'+obj.me+'_single_refresh').button().prop('disabled', false);
        $('#'+obj.me+'_auto_refresh').button().html("Start auto-refresh");
        obj.autoRefreshOn = false;
        return;
      } else {
        console.log("Starting auto-refresh");
        $('#'+obj.me+'_auto_refresh').button().html("Stop auto-refresh");
        obj.autoRefreshOn = true;
      }
      obj.autoRefresh();
    });
  }
};
