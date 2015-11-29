var total = 0;
// var types = ["grandma", "dad", "mom", "son", "daughter"];
var emos = ["angry", "sad", "happy", "normal", "scared"];
var colors = ["#B4E0DC", "#1DAFEC", "#9CD09C", "#A18981", "#F3896B"];
var atms = []
var images = ["static/img/winter_wp1.jpg", "static/img/winter_wp2.jpg", "static/img/winter_wp3.jpg", "static/img/summer_wp1.jpg", "static/img/summer_wp2.png", "static/img/summer_wp3.jpg"];

var render_msg = function (user, msg, emotion, place){
	atms.push(emotion);
	if (user=='System' || user=='undefined'){
		return;
	}
	$("#" + user).find("div .qtime").remove();
	if (place!='home' && place!='university')  place='building';
	fa = '<i class="fa fa-2x fa-' + place+ '"></i>';
	$('#lines').append($('<p>').append(fa + '<b>' + ms[user] + ': </b>').append($('<em>').text(msg)));
	tag = (new Date()).getTime();
	$span = $("<span tag='" + tag + "'>").html(msg+"<br/>");
	$("#" + user + " .message > div").append($span);
	if (emotion) $("#" + user +"> div>img").attr('src','static/img/'+ms[user]+'_' + emotion+'.png');
}

var render_user = function(user){
	if (ms[user]=='house') return;
	var bit = user%2;
	var side = bit ? 'left': 'right';
	var sideDiv = 'col-xs-6 pull-' + side; 
  	var sideMessage = 'talkbubble ' + side;

	var $div = [];
	var $person = $("<div>", {id: user, class: sideDiv});
	$div[0] = $("<div>", {class: "col-xs-6"})
	.html($("<img>", {class: "img-responsive"+(bit ?" flip":""),src:"static/img/"+ms[user]+"_normal.png", style: "width: 100%;"}));
	$div[1] = $("<div>", {class: "message col-xs-6"})
		.html($("<div>", {class: sideMessage, style: "background-color: " + colors[user-1]}));
	$person.append($div[1-bit]).append($div[bit]);
	$("#people").append($person);
	render_msg(user, (ms[user]=='house')?"HOME":"", "normal");
}

var declare_users = function(){
	var house=0;
	for (var i=0; i<msid.length; i++){
		if (ms[msid[i]]=='house') {
			house = i;
			continue;
		}
		render_user(msid[i]);
	}
	render_user(msid[house]);
}

declare_users();
// for (var i=1; i<6; i++)
// 	render_user(i);
var calcSpan = function(dtime){
	var text ="Active ";
	if (dtime>60){
		dtime=Math.round(dtime/60);
		if (dtime>60){
			dtime=Math.round(dtime/60);
			if (dtime>24) text = text+dtime + "day(s) ";
			else text = text+dtime + "hour(s) ";
		} else text = text+dtime + "min(s) ";
	} else text = text + " a few seconds ";
	text = text+" ago.";
	return text;
}

window.setInterval(function(){
	$(".message").each(function(){
		var messageTotal = $(this).find("div>span").length;
		var user = $(this).parent().attr('id');
		if (messageTotal ==1){
			var t = $(this).find('span').get(0).getAttribute('tag');
			var qtime = new Date(parseInt(t));
			var dtime = Math.round((new Date().getTime()-qtime)/1000);

			if ($(this).find('.qtime').length==0){
				$qp = $("<div>", {class: 'qtime', style:'font-size:8px; font-strech:condensed'}).html(calcSpan(dtime));
				$(this).find('div').append($qp);
			}
			else {
				$(this).find('.qtime').html(calcSpan(dtime))
			}
			return;
		}
		$(this).find("div>span").each(function(index){
		dtag = (new Date()).getTime();
		if (dtag - $(this).attr('tag') > 5000 ){
			$(this).fadeOut( "slow", function() {
				$(this).remove();
			});
		}

		});

	});
}, 1000);

window.setInterval(function(){
	cnt = atms.length;
	sum = 0;
	for (var i = 0; i < cnt; i++) {
		if(atms[i] != 'normal' && atms[i] != 'happy') {
			sum ++;
		}
	}
	if (sum > cnt/2) {
		num = Math.floor((Math.random() * (images.length - 1)) + 1);
		console.log('num: ', num, 'sum: ', sum);
		$(document.body).css('background-image', 'url(' + images[num] + ')');
		move_character();
	}
	atms = [];

}, 10000);

function move_character() {
	character = $('#character');
	//character.removeClass("hidden");
	character.animate({opacity: 1}, 1);
	character.animate({left: "-=750px"}, 5000);
	character.animate({left: "+=750px"}, 1);
	//character.addClass("hidden");
	character.animate({opacity: 0.01}, 1);
}

var work = [];
work["lat"]= 35.5969408;
work["long"]= 139.67262;
var home = [];
home["lat"]=35.6597839;
home["long"] = 139.6770864;
var school =[];
school["lat"]= 35.7085195;
school["long"]=139.7568903;


function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}
 

var lat, lon;

function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	url = "comgooglemaps://?center=" + lat + "," + lon + "&zoom=14&views=traffic";
	$("#map").html(Math.round(distance(lat, lon, home['lat'], home['long'], "K")*1000));          
}
function getLocation() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(showPosition);
	} else {
	  alert("Geolocation is not supported by this browser.");
	}
}

// getLocation();   



$('#myHome').click(function(){
	$('.home-modal-lg').modal();
	$('#temps').html(13);
})


$('#home-light').click(function(){
	console.log("light on");
	$.get('http://10.10.0.209:8000/api/action1');
})


$('#3>div>img').click(function(){
	console.log("grandpa clicked");
	$('.grandpa-modal').modal();

})