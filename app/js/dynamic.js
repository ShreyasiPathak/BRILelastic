var dynamicgraph_options={
    chart: {
        renderTo: 'container2',
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series = this.series[0];
                var k=0;
                setInterval(function () {
                    $.ajax({
                        url: "http://localhost:9234/_search?size=1",
                        type: "POST",
                        dataType: "text"
                    }).done(function(data1){
                        var result1=[];
                        var resultfinal1=[];
                        console.log("in setInterval");
                        result1=JSON.parse(data1);
                        for (var j=0;j<result1.length;j++) {
                            resultfinal1.push(JSON.parse(result1[j]));
                            console.log("resultfinal1"+resultfinal1.length);
                        }
                        var x =(new Date(resultfinal1[0].Timestamp)).getTime(),
                            y =resultfinal1[0].Percentabort1[2]
                        console.log("addpoint");
                        console.log([x,y]);
                        series.addPoint([x, y], true, true);
                    })
                }, 3500);     
            }
        }
    },
    title: {
        text: 'Percentabort1'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'Value'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: []
}