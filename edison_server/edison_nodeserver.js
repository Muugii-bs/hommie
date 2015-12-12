/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A simple node.js application intended to blink the onboard LED on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client:
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/

/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)
var mraa = require('mraa');

// globals
var gl_humidity = 0;
var gl_shake = 0;
var do_command = 0;

// ===Server
var http = require('http');
var qs = require('querystring');

var http_port = 8000
var server = http.createServer();

server.on("request", function(req, res) {
    // HTTPレスポンスヘッダを作成
    res.writeHead(200);

    // リクエストのURLによって処理を分ける
    if (req.url === "/") {
        res.write("edison running.")
    }
    else if (req.url === "/test") {
        res.write("実験用ページです。")
    }
    else if (req.url === "/api/right") {
        myUln200xa_obj.control(4096, 1, 5);
    }
    else if (req.url === "/api/shake") {
        gl_shake ++;
        console.log("Shake received: " + gl_shake);
        res.write("ok");
    }
    else if (req.url === "/api/humidity") {
        // recv humidity
        var body = '';

        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            var post = qs.parse(body);
            console.log("Humidity received: " + post.humidity);
            // update global
            gl_humidity = parseInt(post.humidity);

        });
    }
    // do commands
    else if (req.url === "/api/do1"){
        do_command = 1;
        console.log("Do command: " + do_command);
        res.write("ok");
    }
    else if (req.url === "/api/do2"){
        do_command = 2;
        console.log("Do command: " + do_command);
        res.write("ok");
    }
    else if (req.url === "/api/do3"){
        do_command = 3;
        console.log("Do command: " + do_command);
        res.write("ok");
    }
    else if (req.url === "/api/do4"){
        do_command = 4;
        console.log("Do command: " + do_command);
        res.write("ok");
    }
    else if (req.url === "/api/done"){
        console.log("Do command: " + do_command + " DONE!");
        do_command = 0;
        res.write("ok");
    }
    else if (req.url === "/api/getcommand"){
        res.write(String(do_command));
    }
    // edison actions
    else if (req.url === "/api/action1"){
        console.log("Action 1!");
        // action1
        ledLight();
        res.write("ok");
    }
    else if (req.url === "/api/action2"){
        console.log("Action 2!");
        // action2
        res.write("ok");
    }
    else if (req.url === "/api/action3"){
        console.log("Action 3!");
        // action3
        res.write("ok");
    }
    else if (req.url === "/api/test") {
        var body = '';

        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            var post = qs.parse(body);
            res.write("ok");
        });
    }
    else {
        console.log("404 " + req.url);
        res.write("404");
    }

    // レスポンスを終了する
    res.end();
});
server.listen(http_port);


// ===POST data to main server
var request = require("request")
var mainServerURL = "http://hommee.co/"
// loop every 5 second
// sends sensor datas
setInterval(function(){

    var data = new Object();
    data.humidity = gl_humidity;
    data.temperature = readTemp();
    data.shake = gl_shake;
    console.log("Send T: " + data.temperature + ", H: " + data.humidity + "%, S: " + data.shake);


    // fire request
    sendSensorData(1, String(data.temperature));
    sendSensorData(2, String(data.humidity));
    sendSensorData(3, String(data.shake));
},60 * 1000);

function sendSensorData (sensor_id, value){
    var url = mainServerURL + "api/sensor_value";

    var query = { form: { "sensor_id": sensor_id, "value": value } };
    request.post(
        url,
        query,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log( "Sensor data sent. " + sensor_id + ":" + value + ": " + body)
            }
        }
    );
}

// ===send message to home
function sendMessage(msg, emotion){
    var url = mainServerURL + "api/home_message"

    var family_id = 1;
    var query = new Object();
    query.msg = msg;
    query.family_id =  family_id;
    query.emotion = emotion;

    var options = {
      url: url,
      method: 'POST',
      json: query
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log( "Message sent. " + msg + ":" + emotion);
      }
    });

}
sendMessage("Edison server restarted.", "happy")

// ===reset shake every 5 min
setInterval(function(){
    gl_shake = 0;
    console.log("Shake reset:" + gl_shake)
}, 1000 * 60 * 5);

// ===Temperature===
// Load Grove module
var groveSensor = require('jsupm_grove');
// Create the temperature sensor object using AIO pin 0
var temp = new groveSensor.GroveTemp(0);

// Read the temperature ten times, printing both the Celsius and Farenheit
var readTemp = function() {
    var celsius = temp.value();
    var fahrenheit = celsius * 9.0/5.0 + 32.0;
    return celsius;
};

// ===LED===
// Create the Grove LED object using GPIO pin 2
var led = new groveSensor.GroveLed(2);

function ledLight(){
    led.write(1);
    setTimeout(function(){
        led.write(0);
    }, 2000);
}


// ===Motor===
var Uln200xa_lib = require('jsupm_uln200xa');
// Instantiate a Stepper motor on a ULN200XA Darlington Motor Driver
// This was tested with the Grove Geared Step Motor with Driver

// Instantiate a ULN2003XA stepper object
var myUln200xa_obj = new Uln200xa_lib.ULN200XA(4096, 5, 6, 7, 8);

myUln200xa_obj.control = function(rotation, direction, speed)
{
    // def speed=5
    speed = typeof speed !== 'undefined' ? speed : 5;
    // direction 1=clockwise 0=ccw
    direction = typeof direction !== 'undefined' ? direction : 1;
    // def rotation=4096
    rotation = typeof rotation !== 'undefined' ? rotation : 4096;

    myUln200xa_obj.setSpeed(speed); // 5 RPMs
    if (direction == 1){
        myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
    } else {
        myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CCW);
    }

    txt = direction == 1 ? "clockwise" : "counter clockwise"
    console.log("Rotating " + rotation + " revolution " + txt + " with speed " + speed);
    myUln200xa_obj.stepperSteps(rotation);
};

myUln200xa_obj.goForward = function()
{
    myUln200xa_obj.setSpeed(5); // 5 RPMs
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CW);
    console.log("Rotating 1 revolution clockwise.");
    myUln200xa_obj.stepperSteps(4096);
};

myUln200xa_obj.goReverse = function()
{
    myUln200xa_obj.setSpeed(5); // 5 RPMs
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CCW);
    console.log("Rotating 1 revolution counter clockwise.");
    myUln200xa_obj.stepperSteps(4096);
};

myUln200xa_obj.reverseDirection = function()
{
    console.log("Rotating 1/2 revolution counter clockwise.");
    myUln200xa_obj.setDirection(Uln200xa_lib.ULN200XA.DIR_CCW);
    myUln200xa_obj.stepperSteps(2048);
};

myUln200xa_obj.stop = function()
{
    myUln200xa_obj.release();
};

myUln200xa_obj.quit = function()
{
    myUln200xa_obj = null;
    Uln200xa_lib.cleanUp();
    Uln200xa_lib = null;
    console.log("Exiting");
    process.exit(0);
};

// Run ULN200xa driven stepper
// myUln200xa_obj.goForward();
//setTimeout(myUln200xa_obj.reverseDirection, 2000);
//setTimeout(function()
//{
//  myUln200xa_obj.stop();
//  myUln200xa_obj.quit();
//}, 2000);
