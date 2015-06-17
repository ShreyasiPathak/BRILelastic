$(document).ready(function(){
var seconds=500;
function arrgeneration() {
                    // generate an array of random data
                    var arr=[];
                    var k=1;
                    while(k<=48)
                    {
                        arr.push((k*0.5));
                        k++;
                    }
                    return arr;
};
var arr=[];
arr=arrgeneration();
$(function () {
   	$('#container1').highcharts({
		chart: {
    			type: 'spline'
		},
		title: {
    			text: 'Snow depth at Vikjafjellet, Norway'
		},
		subtitle: {
    			text: 'Irregular time data in Highcharts JS'
		},
		xAxis: {
    			type: 'datetime',
    			dateTimeLabelFormats: { // don't display the dummy year
        			second: '%H:%M:%S'
    			},
    			title: {
        			text: 'Date'
    			}
		},
		yAxis: {
    			title: {
        			text: 'Snow depth (m)'
    			},
    			tickInterval:1,
    			min: 0
		},
		tooltip: {
    			headerFormat: '<b>{series.name}</b><br>',
    			pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
		},
		plotOptions: {
    			spline: {
        			marker: {
            				enabled: true
        			}
    			}
		},
		series: [
		{
    			name: 'ar[0]',
            			// Define the data points. All series have a dummy year
            			// of 1970/71 in order to be compared on the same x axis. Note
            			// that in JavaScript, months start at 0 for January, 1 for February etc.
    			data: (function () {
                    			// generate an array of random data
            			var data = [],
                	            i;
            			var year=2015;
            			var month=6;
            			var day=16;
            			var hours=15;
            			var minutes=10;
            			var j=0;
            			while(j<seconds)
            			{
               				var d = new Date(year, month, day, hours, minutes, j, 0);
                			data.push({
                    				x:d,
                    				y:arr[0]
                			});
                			j++;
            			}
            			return data;
        		}())
		}, {
    			name: 'ar[10]',
    			data: (function () {
            			// generate an array of random data
            			var data = [];
            			var year=2015;
            			var month=6;
            			var day=16;
            			var hours=15;
    				var minutes=10;
    				var j=0;
    				while(j<seconds)
    				{
       					var d = new Date(year, month, day, hours, minutes, j, 0);
        				data.push({
            					x:d,
            					y:arr[10]
        				});
                			j++;
            			}
            			return data;
        		}())
		}, {
    			name: 'ar[12]',
    			data: (function () {
            			// generate an array of random data
            			var data = [],
                		    i;
            			var year=2015;
            			var month=6;
            			var day=16;
            			var hours=15;
            			var minutes=10;
            			var j=0;
           			while(j<seconds)
            			{
               				var d = new Date(year, month, day, hours, minutes, j, 0);
                			data.push({
                    				x:d,
                    				y:arr[12]
                			});
                			j++;
            			}
            			return data;
        		}())
		}]
	});
});
});
