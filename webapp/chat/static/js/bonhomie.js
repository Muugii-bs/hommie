var total = 0;
// var types = ["grandma", "dad", "mom", "son", "daughter", "grandpa"];
var emos = ["angry", "sad", "happy", "normal", "scared"];
var colors = ["#B4E0DC", "#1DAFEC", "#9CD09C", "#A18981", "#F3896B", "#BF1E2E"];
var colors = {}
var atms = []
var images = ["static/img/winter_wp1.jpg", "static/img/winter_wp2.jpg", "static/img/winter_wp3.jpg", "static/img/summer_wp1.jpg", "static/img/summer_wp2.png", "static/img/summer_wp3.jpg"]

colors["grandma"] = "#B4E0DC";
colors["dad"] = "#1DAFEC";
colors["mom"] = "#9CD09C";
colors["son"] = "#A18981";
colors["daughter"] = "#F3896B";
colors["grandpa"] = "#BF1E2E";

var render_msg = function (user_id, msg, emotion, place){
	console.log("place: " + place);
	
	if (place=='undefined')  place='street-view';
	atms.push(emotion);
	if (user_id=='System' || user_id=='undefined'){
		return;
	}
	$("#" + user_id).find("div .qtime").remove();
	
	fa = '<i class="fa fa-2x fa-' + place+ '"></i>';
	$('#lines').append($('<p>').append(fa + '<b>' + ms[user_id] + ': </b>').append($('<em>').text(msg)));
	
	tag = (new Date()).getTime();
	$span = $("<span>", {tag:tag}).html(msg+"<br/>");
	// $span = $("<span>", {tag:tag});
	$("#" + user_id + " .message > div").append($span);
	// $span.typed({
 //        strings: [msg],
 //        typeSpeed: 3
 //      })
	if (emotion) $("#" + user_id +"> div>img").attr('src','static/img/'+ms[user_id]+'_' + emotion+'.png');
}

var render_user = function(user){
	var bit = user%2;
	var side = bit ? 'left': 'right';
	var sideDiv = 'col-xs-6 pull-' + side; 
  	var sideMessage = 'talkbubble ' + side;

	var $div = [];
	var $person = $("<div>", {id: user, class: sideDiv});
	$div[0] = $("<div>", {class: "col-xs-6"})
	.html($("<img>", {class: "img-responsive"+(bit ?" ":""),src:"static/img/"+ms[user]+"_normal.png", style: "width: 100%;"}));
	$div[1] = $("<div>", {class: "message col-xs-6"})
		.html($("<div>", {class: sideMessage, style: "background-color: " + colors[ms[user]]}));
	//$div[1].html({class: "img-responsive", id: "myHome", src:"static/img/house.png, style: "width: 30%});
	$person.append($div[1-bit]).append($div[bit]);
	$("#people").append($person);
	if (user==familySize){
		// $qi = $("<i>", {class: "fa fa-power-off"});
		$qi = $("<button>", {type:"button",id:"home-light"}).text("Light");
		$div[0].append($qi);
	}
	render_msg(user, (ms[user]=='house')?"HOME":"", "normal", my_place);
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
}, 500);

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
	character.animate({left: "-=1550px"}, 7000);
	character.animate({left: "+=1550px"}, 1);
	//character.addClass("hidden");
	character.animate({opacity: 0.01}, 1);
}

// var work = [];
// work["lat"]= 35.5969408;
// work["long"]= 139.67262;
// var home = [];
// home["lat"]=35.6597839;
// home["long"] = 139.6770864;
// var school =[];
// school["lat"]= 35.7085195;
// school["long"]=139.7568903;


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
 



function showPosition(position) {
	console.log("Location: " + my_place);
	var lat, lon;
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	// url = "comgooglemaps://?center=" + lat + "," + lon + "&zoom=14&views=traffic";
	// $("#map").html();
	//street-view, university, building, home
	if (Math.round(distance(lat, lon, home_lat, home_long, "K")*1000) < 50){
		my_place = 'home';
		
	} else if (Math.round(distance(lat, lon, work_lat, work_long, "K")*1000) < 50){
		my_place = 'work';
		if (user == 3 || user == 4)  my_place = 'university';
	}
}
function getLocation() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(showPosition);
	} else {
	  alert("Geolocation is not supported by this browser.");
	}
}

getLocation();   


$('#6>div>img').click(function(){
	$('.home-modal-lg').modal();
	$('#temps').html(13);
	$tmp = $("#" + familySize + "div >img");
	console.log($tmp);

})


$('#home-light').click(function(){
	console.log("light on");
	$.get('http://10.10.0.209:8000/api/action1');
	pic = msid[familySize - 1];
	$tmp = $("#" + pic).find('div>img');
	$tmp.attr('src', 'static/img/house_happy.png');  
	console.log("id: ", pic, "tmp: ", $tmp); 
	setTimeout(function(){
		$tmp.attr('src', 'static/img/house_normal.png');
	}, 5000);
})


$('#3>div>img').click(function(){
	console.log("grandpa clicked");
	$('.grandpa-modal').modal();

})
