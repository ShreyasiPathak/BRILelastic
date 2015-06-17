/*eslint strict:0 */
//
// Fetch and display data for a 'multiple_axes' chart
//
var multiple_axes = { // this is a global object, so pick a name that represents your view uniquely
  me: 'multiple_axes', // put the name of the object here too. Makes the rest of the code more generic

  activeButton: null, // holds 'loading' state of 'Single refresh' button
  animate: true,

  get: function() {
    var url;
    url = baseUrl + "/get/" + this.me + "/data";

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
  successGet: function(response) { // } , textStatus, jqXHR) { // callback for displaying data
//  Reset 'loading' state of single-refresh button, if it was active
    if ( this.activeButton ) { this.activeButton.button('reset'); }

//
//  Parse the data into a useable form
    var data = response.data;

//
//  Add a 'download JSON' option to the menu button. Have to clone the Highcharts menu and
//  append to that, otherwise you get a mess
//
    var menuItemsOrig = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    var menuItems = $.extend([], true, menuItemsOrig);
    menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('BASIC_AREA data.json', data); } } );

//
//  This is the meat of the plotting functionality.
//
//  Choose a chart-type that you like from http://www.highcharts.com/demo, copy
//  the code here, and manipulate it until it shows your data the way you like.
//
    this.chart = new Highcharts.Chart(
    {
// TEMPLATE CHART
      chart: {
        renderTo: this.me+'-chart',
        zoomType: 'xy'
      },
      title: {
        text: 'Average Monthly Weather Data for Tokyo'
      },
      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }],
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value}°C',
          style: {
            color: Highcharts.getOptions().colors[2]
          }
        },
        title: {
          text: 'Temperature',
          style: {
            color: Highcharts.getOptions().colors[2]
          }
        },
        opposite: true

      }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Rainfall',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} mm',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        }

      }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Sea-Level Pressure',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          format: '{value} mb',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 80,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
      series: [{
        animation: this.animate,
        name: 'Rainfall',
        type: 'column',
        yAxis: 1,
        data: data.rainfall,
        tooltip: {
          valueSuffix: ' mm'
        }

      }, {
        animation: this.animate,
        name: 'Sea-Level Pressure',
        type: 'spline',
        yAxis: 2,
        data: data.sea_level_pressure,
        marker: {
          enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
          valueSuffix: ' mb'
        }

      }, {
        animation: this.animate,
        name: 'Temperature',
        type: 'spline',
        data: data.temperature,
        tooltip: {
          valueSuffix: ' °C'
        }
      }]
    }
// TEMPLATE CHART
  );

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
