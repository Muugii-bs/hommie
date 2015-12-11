function HomeTempPlot(){

    var url = "api/sensor_history?sensor_id=1&span_mins=1440";
    var data_temp = [];
    var dates = [];
    var current_temp = 20;
    var current_date;

    // Temperature
    $.getJSON(url, function(temp){
        // console.log(temp);

        for (var i = 0; i < temp['data'].length; i++) {
            var value = temp['data'][i]['value'];
            var date = temp['data'][i]['timestamp'];
            data_temp.push([i, value]);
            dates.push([i, date.slice(-13, -8)]);
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

            for (var j = 0; j < humi['data'].length; j++) {
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
            // console.log(dates);
            $("#current_temp").text(current_temp + ' ' + current_humi + ' ' + current_date);
        });
    });


}


function plot_chart(data1, data2, label1, label2, xmax, dates){
    $.plot(
        // html div
        $("#chart_home"),

        // datas
        [
            {data: data1, label: label1, color: "orange"},
            {data: data2, label: label2, color: "blue", yaxis: 2}
        ],

        // options
        {
            legend: {position: "sw"},

            yaxis: {min: 0, max: 50},
            y2axis: {min: 0, max: 100},
            // xaxis: {min: xmax-100, max: xmax},
            xaxis: {
                ticks: dates
            }
        }

    );
}


















