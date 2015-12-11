var data_sensor1 = [];
var data_sensor2 = [];
var data_sensor3 = [];


var ajaxGraph = new Rickshaw.Graph.Ajax( {
    element: document.getElementById("chart"),
    width: 400,
    height: 200,
    renderer: 'line',
    dataURL: 'api/sensor_history?sensor_id=1&span_mins=1440',
    onData: function(d) {
        // console.log(d['data']);
        // for (i = 0; i < d['data'].length; i++) {
        //    // console.log(d['data'][i]);
        //    var id = d['data'][i]['id'];
        //    var sensor_id = d['data'][i]['sensor_id'];
        //    var timestamp = d['data'][i]['timestamp'];
        //    var value = parseInt(d['data'][i]['value']);
        //    console.log(id, sensor_id, timestamp, value);
        //    if(sensor_id == 1){
        //         console.log(data_sensor1);
        //         // var data = {};
        //         // data['x'] = value;
        //         // data['y'] = value;
        //         // data_sensor1.push(data);
        //         data_sensor1.push({x: value, y: value})
        //         // JSON.stringify(data_sensor1);
        //    }
        //    if(sensor_id == 2){
        //         data_sensor2.push({'x': value, 'y': value});
        //    }
        //    if(sensor_id == 3){
        //         data_sensor3.push({'x': value, 'y': value});
        //    }
        // }

        return d
        },
    series: [
	{
	    name: 'New York',
	    color: '#c05020',
	}, {
	    name: 'London',
	    color: '#30c020',
	}, {
	    name: 'Tokyo',
	    color: '#6060c0'
	}
    ]
} );


var data = [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 17 }, { x: 3, y: 42 } ];

var graph = new Rickshaw.Graph( {
        element: document.querySelector("#chart"),
        width: 580,
        height: 250,
        series: [ {
                color: 'steelblue',
                data: data
        } ]
} );

graph.render();




// ================================================

var data_grandpa = [
        { x: 0, y: 40 },
        { x: 1, y: 44 },
        { x: 2, y: 47 },
        { x: 3, y: 50 },
        { x: 4, y: 55 },
        { x: 5, y: 60 },
        { x: 6, y: 55 },
        { x: 7, y: 44 },
        { x: 8, y: 30 },
        { x: 9, y: 20 },
        { x: 10, y: 13 },
        { x: 11, y: 12 },
        { x: 12, y: 10 },
        { x: 13, y: 12 },
        { x: 14, y: 12 },
        { x: 15, y: 13 } ];

var graph_grandpa = new Rickshaw.Graph( {
        element: document.querySelector("#chart_grandpa"),
        width: 580,
        height: 250,
        series: [ {
                color: 'red',
                data: data_grandpa
        } ]
} );

graph_grandpa.render();


// -------------------------------
