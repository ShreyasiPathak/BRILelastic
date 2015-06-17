/*eslint strict:0 */
//
// Fetch and display data for a 'heatmap' chart
//
var heatmap = { // this is a global object, so pick a name that represents your view uniquely
  me: 'heatmap', // put the name of the object here too. Makes the rest of the code more generic

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
  successGet: function(response) { // , textStatus, jqXHR) { // callback for displaying data
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
    $('#'+this.me+'-chart').highcharts({
      data: {
        rows: data.heatmap
      },

      chart: {
        type: 'heatmap',
        margin: [60, 10, 80, 50]
      },

      title: {
        text: 'Highcharts extended heat map',
        align: 'left',
        x: 40
      },

      subtitle: {
        text: 'Temperature variation by day and hour through 2013',
        align: 'left',
        x: 40
      },

      tooltip: {
        backgroundColor: null,
        borderWidth: 0,
        distance: 10,
        shadow: false,
        useHTML: true,
        style: {
          padding: 0,
          color: 'black'
          // ,zIndex: 99999
        }
      },

      xAxis: {
        min: Date.UTC(2013, 0, 1),
        max: Date.UTC(2014, 0, 1),
        labels: {
          align: 'left',
          x: 5,
          format: '{value:%B}' // long month
        },
        showLastLabel: false,
        tickLength: 16
      },

      yAxis: {
        title: {
          text: null
        },
        labels: {
          format: '{value}:00'
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [0, 6, 12, 18, 24],
        tickWidth: 1,
        min: 0,
        max: 23,
        reversed: true
      },

      colorAxis: {
        stops: [
          [0, '#3060cf'],
          [0.5, '#fffbbc'],
          [0.9, '#c4463a'],
          [1, '#c4463a']
        ],
        min: -15,
        max: 25,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: '{value}℃'
        }
      },

      series: [{
        borderWidth: 0,
        nullColor: '#EFEFEF',
        colsize: 24 * 36e5, // one day
        tooltip: {
          headerFormat: 'Temperature<br/>',
          pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
        },
        turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
      }]

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
    this.extend();
    views.push(this); // register this global view object
    return this; // Return 'this' so I can call init() directly, avoiding typing the name one more time!
  },

  extend: function() { // this is standard stuff from the heatmap demo, nothing to change here
    /**
     * This plugin extends Highcharts in two ways:
     * - Use HTML5 canvas instead of SVG for rendering of the heatmap squares. Canvas
     *   outperforms SVG when it comes to thousands of single shapes.
     * - Add a K-D-tree to find the nearest point on mouse move. Since we no longer have SVG shapes
     *   to capture mouseovers, we need another way of detecting hover points for the tooltip.
     */
    (function (H) {
      /**
       * Recursively builds a K-D-tree
       */
      function KDTree(points, depth) {
        var axis, median, length = points && points.length;

        if (length) {
          // alternate between the axis
          axis = ['plotX', 'plotY'][depth % 2];

          // sort point array
          points.sort(function (a, b) {
              return a[axis] - b[axis];
          });

          median = Math.floor(length / 2);

          // build and return node
          return {
              point: points[median],
              left: KDTree(points.slice(0, median), depth + 1),
              right: KDTree(points.slice(median + 1), depth + 1)
          };
        }
      }

      /**
       * Recursively searches for the nearest neighbour using the given K-D-tree
       */
      function nearest(search, tree, depth) {
        var point = tree.point,
            axis = ['plotX', 'plotY'][depth % 2],
            tdist,
            sideA,
            sideB,
            ret = point,
            nPoint1,
            nPoint2;

        // Get distance
        point.dist = Math.pow(search.plotX - point.plotX, 2) +
            Math.pow(search.plotY - point.plotY, 2);

        // Pick side based on distance to splitting point
        tdist = search[axis] - point[axis];
        sideA = tdist < 0 ? 'left' : 'right';

        // End of tree
        if (tree[sideA]) {
          nPoint1 = nearest(search, tree[sideA], depth + 1);

          ret = (nPoint1.dist < ret.dist ? nPoint1 : point);

          sideB = tdist < 0 ? 'right' : 'left';
          if (tree[sideB]) {
            // compare distance to current best to splitting point to decide wether to check side B or not
            if (Math.abs(tdist) < ret.dist) {
              nPoint2 = nearest(search, tree[sideB], depth + 1);
              ret = (nPoint2.dist < ret.dist ? nPoint2 : ret);
            }
          }
        }
        return ret;
      }

      // Extend the heatmap to use the K-D-tree to search for nearest points
      H.seriesTypes.heatmap.prototype.setTooltipPoints = function () {
        var series = this;

        this.tree = null;
        setTimeout(function () {
          series.tree = KDTree(series.points, 0);
        });
      };
      H.seriesTypes.heatmap.prototype.getNearest = function (search) {
        if (this.tree) {
          return nearest(search, this.tree, 0);
        }
      };

      H.wrap(H.Pointer.prototype, 'runPointActions', function (proceed, e) {
        var chart = this.chart;
        proceed.call(this, e);

        // Draw independent tooltips
        H.each(chart.series, function (series) {
          var point;
          if (series.getNearest) {
            point = series.getNearest({
              plotX: e.chartX - chart.plotLeft,
              plotY: e.chartY - chart.plotTop
            });
            if (point) {
              point.onMouseOver(e);
            }
          }
        });
      });

      /**
       * Get the canvas context for a series
       */
      H.Series.prototype.getContext = function () {
        var canvas;
        if (!this.ctx) {
          canvas = document.createElement('canvas');
          canvas.setAttribute('width', this.chart.plotWidth);
          canvas.setAttribute('height', this.chart.plotHeight);
          canvas.style.position = 'absolute';
          canvas.style.left = this.group.translateX + 'px';
          canvas.style.top = this.group.translateY + 'px';
          canvas.style.zIndex = 0;
          canvas.style.cursor = 'crosshair';
          this.chart.container.appendChild(canvas);
          if (canvas.getContext) {
            this.ctx = canvas.getContext('2d');
          }
        }
        return this.ctx;
      };

      /**
       * Wrap the drawPoints method to draw the points in canvas instead of the slower SVG,
       * that requires one shape each point.
       */
      H.wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function (proceed) {
        var ctx;
        if (this.chart.renderer.forExport) {
          // Run SVG shapes
          proceed.call(this);
        } else {
          ctx = this.getContext();
          if (ctx) {
            // draw the columns
            H.each(this.points, function (point) {
              var plotY = point.plotY,
                  shapeArgs;

              if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
                shapeArgs = point.shapeArgs;

                ctx.fillStyle = point.pointAttr[''].fill;
                ctx.fillRect(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height);
              }
            });
          } else {
            this.chart.showLoading("Your browser doesn't support HTML5 canvas, <br>please use a modern browser");
          }
        }
      });
    }(Highcharts));
  }
}.init();

