/*eslint strict:0 */
//
// Fetch and display BCM1F data
//
var bcm1f = { // this is a global object, so pick a name that represents your view uniquely
  me: 'bcm1f', // put the name of the object here too. Makes the rest of the code more generic

  activeButton: null, // holds 'loading' state of 'Single refresh' button
  animate: true,

  get: function() {
    var url = baseUrl + "/get/" + this.me + "/data";
    console.log("GETting "+this.me.toUpperCase()+" data from " + url);
    $.ajax({
      dataType: "json",
      url: url,
      success: this.successGet,
      error:   this.errorGet,
      context: this
    });
  },
  errorGet: function(response, textStatus, jqXHR) { // callback for handling ajax errors data
    console.log("errorGet: Ajax call failed: status = "+jqXHR.status);
    console.log("errorGet response:", JSON.stringify(response));
    console.log("errorGet jqXHR:", JSON.stringify(jqXHR));
    console.log("errorGet textStatus:", textStatus);
    ajaxFail("#"+this.me+"-chart-message", jqXHR, textStatus);
  },
  successGet: function(response) { // , textStatus, jqXHR) { // callback for displaying data
//  Reset 'loading' state of single-refresh button, if it was active
    if ( this.activeButton ) { this.activeButton.button('reset'); }

//
//  Parse the data into a useable form
//
    var yMax = 200, // could examine the data and set the y-scale accordingly
        data = response.data;

//
//  Add a 'download JSON' option to the menu button. Have to clone the Highcharts menu and
//  append to that, otherwise you get a mess
//
    var menuItemsOrig = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    var menuItems = $.extend([], true, menuItemsOrig);
    menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('BCM1F data.json', data); } } );

//
//  This is the meat of the plotting functionality.
//
//  Choose a chart-type that you like from http://www.highcharts.com/demo, copy
//  the code here, and manipulate it until it shows your data the way you like.
//
    this.chart = new Highcharts.Chart({
      // Naming convention: renderTo -> (name-of-this-object) + '-chart'
      chart: { renderTo: this.me+'-chart', type: 'column' },
      title: { text: 'BCM1F channel comparison' },
      subtitle: { text: getFormattedDate()+' Run number: '+response.runNumber },
      exporting: {
        buttons: {
          contextButton: {
            enabled: true,
            text: 'Export data',
            menuItems: menuItems
          }
        }
      },
      xAxis: {
        categories: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ]
      },
      yAxis: {
        min: 0,
        max: yMax,
        title: { text: 'Counts' }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          animation: this.animate,
          cursor: 'pointer',
          events: {
            click: function(event) {
                setFadeMessage("#bcm1f-chart-message",
                               "Detector: " + this.name +
                                  ", channel " + event.point.x + " = " +
                                  data[this.name][event.point.x],
                               "bg-success");
            }
          }
        }
      },
      series: [
        { name: 'BCM1F_1', data: data.BCM1F_1 },
        { name: 'BCM1F_2', data: data.BCM1F_2 },
        { name: 'BCM1F_3', data: data.BCM1F_3 },
        { name: 'BCM1F_4', data: data.BCM1F_4 }
      ]
    });

//
// Back to routine stuff. You shouldn't need to change much here...
//
// Disable animations after the first load. They get boring quickly...
    this.animate = false;
  }, // successGet

  start: function() {
    this.handlers();
    $('#'+this.me+'_single_refresh').button().prop('disabled', false);
    $('#'+this.me+'_auto_refresh').button().html("Start auto-refresh");
    this.autoRefreshOn = false;
    this.get();
  },

  handlers: function() {
    setupHandlers(this);
    this.handlers = function() {}; // write me out of the picture!
  },

  init: function() {
    views.push(this); // register this global view object
    return this; // Return 'this' so I can call init() directly, avoiding typing the name one more time!
  }
}.init();
