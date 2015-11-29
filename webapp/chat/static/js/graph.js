var ajaxGraph = new Rickshaw.Graph.Ajax( {
    element: document.getElementById("chart"),
    width: 400,
    height: 200,
    renderer: 'line',
    dataURL: 'api/sensor_history?sensor_id=1&span_mins=1440',
    onData: function(d) { console.log(d); return d },
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
