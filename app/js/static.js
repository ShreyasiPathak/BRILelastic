var staticgraph_options={
		         chart: {
                    renderTo: 'container1',
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
		         series: []
}