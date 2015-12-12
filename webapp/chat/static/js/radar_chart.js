var d1 = [ [0,10], [1,20], [2,80], [3,70], [4,60] ];
var d2 = [ [0,30], [1,25], [2,50], [3,60], [4,95] ];
var d3 = [ [0,50], [1,40], [2,60], [3,95], [4,30] ];
var data = [
        { label: "Pies", color:"green",data: d1,
         spider: {show: true, lineWidth: 12} },
    { label: "Apples",color:"orange",data: d2,
     spider: {show: true} },
    { label: "Cherries",color:"red",data: d3,
     spider: {show: true} }
];

var options = {
    series:{
        spider:{
            active: true,highlight: {mode: "area"},
            legs: {
                    data: [{label: "OEE"},{label: "MOE"},{label: "OER"},{label: "OEC"},{label: "Quality"}],
                legScaleMax: 1,legScaleMin:0.8
            },
            spiderSize: 0.9
        }
    },
    grid:{
        hoverable: true,clickable: true,
        tickColor: "rgba(0,0,0,0.2)",mode: "radar"
    }
};


$.plot($("#chart_radar"),data,options);