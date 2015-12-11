function HomeTempPlot(){

    var url = "api/sensor_history?sensor_id=1&span_mins=1440";
    var data_temp = [];
    var dates = [];
    var current_temp = 20;
    var current_date;
    var interval = 12 * 5;

    // Temperature
    $.getJSON(url, function(temp){
        // console.log(temp);

        for (var i = 0; i < temp['data'].length; i = i + interval) {
            var value = temp['data'][i]['value'];
            var date = temp['data'][i]['timestamp'];
            date = (new Date(date.slice(1, -1))).toString().slice(16, 24)
            data_temp.push([i, value]);
            dates.push([i, date]);
            current_temp = value;
            current_date = date;
        }

        // Humidity
        var url_humi = "api/sensor_history?sensor_id=2&span_mins=1440";
        var data_humi = [];
        var current_humi = 20;
        // get temp API data
        $.getJSON(url_humi, function(humi){
            // console.log(humi);

            for (var j = 0; j < humi['data'].length; j = j + interval) {
                var humi_value = humi['data'][j]['value'];
                data_humi.push([j, humi_value])
                current_humi = humi_value;
            }

            // plot temp, humi chart
            plot_chart(
                data_temp.slice(-10),
                data_humi.slice(-10),
                "Home Temperature",
                "Home Humidity",
                temp['data'].length,
                dates.slice(-10)
            );

            $("#home_temperature").text(current_temp);
            $("#home_humidity").text(current_humi);
        });
    });


}


function plot_chart(data1, data2, label1, label2, xmax, dates){
    $.plot(
        // html div
        $("#chart_home"),

        // datas
        [
            {data: data1, label: label1, color: "orange",
                curvedLines:  { apply: true}
            },
            {data: data2, label: label2, color: "blue", yaxis: 2}
        ],


        // options
        {
            series: { stack: true,
             lines: {show: true, fill: true, },
            curvedLines: {  active: true, fit: true, apply: true },},

            legend: {position: "sw"},

            yaxis: {
                min: 0,
                max: 50,
                tickFormatter: function(val) {return val+" °C";},
                font:{
                    size:12,
                    style:"italic",
                    weight:"bold",
                    family:"sans-serif",
                    variant:"small-caps"
                },
            },

            y2axis: {
                min: 0,
                max: 100,
                tickFormatter: function(val) {return val+" %";},
                font:{
                    size:12,
                    style:"italic",
                    weight:"bold",
                    family:"sans-serif",
                    variant:"small-caps"
                },
            },

            // xaxis: {min: xmax-100, max: xmax},
            xaxis: {
                ticks: dates,
                font:{
                    size:10,
                    style:"italic",
                    weight:"bold",
                    family:"sans-serif",
                    variant:"small-caps"
                }
            },
        }

    );
}


















