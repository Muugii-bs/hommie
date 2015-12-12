var total = 0;
var emos = ["angry", "sad", "happy", "normal", "scared"];
var colors = {};
var atms = [];
var images = ["static/img/winter_wp1.jpg",
			  "static/img/winter_wp2.jpg",
			  "static/img/winter_wp3.jpg",
			  "static/img/summer_wp1.jpg",
			  "static/img/summer_wp2.png",
			  "static/img/summer_wp3.jpg"];

var emotion_score = {}

emotion_score["sad"] 		= 0;
emotion_score["angry"] 		= 0;
emotion_score["scared"] 	= 0;
emotion_score["undefined"] 	= 1;
emotion_score["normal"] 	= 1;
emotion_score["happy"] 		= 2;

colors["grandma"] 	= "#B4E0DC";
colors["dad"] 		= "#1DAFEC";
colors["mom"] 		= "#13A89E";
colors["son"] 		= "#A18981";
colors["daughter"] 	= "#F3896B";
colors["grandpa"] 	= "#BF1E2E";
colors["house"] 	= "#2F3590";

Plot = function ( stage ) {

  this.setDimensions = function( x, y, unit ) {
    this.elm.style.width = x + unit;
    this.elm.style.height = y + unit;

    this.emotion.style.width = x + unit;
    this.emotion.style.height = y + unit;
    this.emotion.style.zIndex = 1;
    //this.emotion.style.background="url('../static/img/happy.png') no-repeat right top";
    this.emotion.style.backgroundSize="contain";
    this.emotion.style.position="relative";
    this.emotion.style.left="8vmin";
    this.emotion.style.bottom="14vmin";
    this.emotion.setAttribute("class", "emotion");

    this.message.setAttribute("class", "message");
    this.message.style.position="relative";
    this.message.style.width = x + unit;
    // this.message.style.top = y + unit;
    this.message.innerHTML = "";

    this.stat.setAttribute("class", "stat");
    this.stat.style.bottom= (y-3) +unit;

    this.width = x;
    this.height = y;
  };
  this.position = function( x, y ) {
    var xoffset = arguments[2] ? 0 : this.width / 2;
    var yoffset = arguments[2] ? 0 : this.height / 2;
    this.elm.style.left = (x - xoffset) + 'vw';
    this.elm.style.top = (y - yoffset) + 'vh';
    this.x = x;
    this.y = y;
  };
  this.setBackground = function( role ) {
    this.elm.id = role;
    // console.log(role);
    // this.elm.style.backgroundImage="url('../static/img/"+role+"_normal.png')";
    this.elm.style.background="url('../static/img/"+ms[role]+".png') no-repeat right top";
    this.elm.style.backgroundSize="contain";

  };
  this.kill = function() {
    stage.removeChild( this.elm );
  };
  this.rotate = function( str ) {
    this.elm.style.webkitTransform = this.elm.style.MozTransform =
    this.elm.style.OTransform = this.elm.style.transform =
    'rotate(' + str + ')';
  };
  this.content = function( content ) {
    this.elm.innerHTML = content;
  };
  this.round = function( round ) {
    this.elm.style.borderRadius = round ? '50%/50%' : '';
  };/*
  this.feel = function (emotion){
  	this.emotion.style.background="url('../static/img/" + emotion+ ".png') no-repeat right top";
  	this.emotion.style.backgroundSize="contain";
  }*/
  this.elm = document.createElement( 'div' );
  this.emotion = document.createElement( 'div' );
  this.message = document.createElement( 'div' );
  this.stat = document.createElement( 'div' );
  // this.emotion.innerHTML = "ETETE";
  this.elm.appendChild(this.emotion);
  this.elm.appendChild(this.message);
  this.elm.appendChild(this.stat);

  this.elm.style.position = 'absolute';
  stage.appendChild( this.elm );
};

var animateMe = function(object, x, y){
  // $(object.elm).first().offset({ top: x, left: y });
  // $(object.elm).offset({ top: 10, left: 200 });
  $(object.elm).first().animate({
    left: x+'vw', // increase by 50
    top: y +'vh', // increase by 50
    // opacity: 0.25,
    // fontSize: '12px'
  },
  1500,
  function() {
    // executes when the animation is done
  }
  );
}


var render_msg = function (sender, msg, emotion, place){
  var user_emotion = ms[sender] + '.' + emotion;
  atms.push(user_emotion);
  if (sender=='System' || sender=='undefined'){
    return;
  }
  $("#" + sender).find("div .qtime").remove();
  if (place!='home' && place!='university')  place='building';
  fa = '<i class="fa fa-2x fa-' + place+ '"></i>';
  $('#lines').append('<div class="clear"></div>');
  $icon = $('<div class="icon">');
  $icon.css({'background-image':'url(static/img/'+ ms[sender]+'.png)'});
  $icon.css({'background-repeat': 'no-repeat'});
  if (sender == user) {
      $icon.css('right','-30px');
      $('#lines').append($('<div class="from-me" style="background-color: ' + colors[ms[sender]] + ';">')
                          .append($icon)
                          .append($('<p style="margin: 0;">').text(msg)));
  } else {
      $icon.css('left','-30px');
      $('#lines').append($('<div class="from-them" style="background-color: ' + colors[ms[sender]] + ';">')
          .append($icon).append($('<p style="margin: 0;">').text(msg)));
  }
  $('#lines').get(0).scrollTop = $('#lines').get(0).scrollHeight;
  $("#" + sender + " > .message").html(msg);

  tag = (new Date()).getTime();
  $span = $("<span>", {tag:tag}).html(msg+"<br/>");
  // $span = $("<span>", {tag:tag});
  $("#" + sender + " .message > div").append($span);
  // $span.typed({
 //        strings: [msg],
 //        typeSpeed: 3
 //      })
 //console.log(sender + " is " + emotion);

  if (emotion) {
	  	$("#" + sender +"> .emotion").css('background-image','').finish();
		$("#" + sender +"> .emotion").css({'background-image':'url(static/img/'+ emotion+'.png)'});
		$("#" + sender +"> .emotion").css({'background-repeat': 'no-repeat'});
	 /* for (var j = 0; j < 3; j ++){
	  	$("#" + sender +"> .emotion").css('background-image','');
	  	$("#" + sender +"> .emotion").css('background-image','url(static/img/'+ emotion+'.png)');
	  }
	 */	
	  for (var i = 100; i < 1100; i += 100) {
		  $("#" + sender +"> .emotion").animate({
		  	opacity: 1 - 0.001 * i,
	  	}, i);
	  }

	$("#" + sender +"> .message").css('background-image','').finish();
  	for (var i = 100; i < 1100; i += 100) {
		  $("#" + sender +"> .message").animate({
		  	opacity: 1 - 0.001 * i,
	  	}, i);
	  }
  }


}



var picSize = 130/familySize, //vmin
    centerX = 45 - picSize, //vw
    centerY = 65- picSize, //vh
    plotRadius = 30; //vmin


var distribute_users = function(){
  var stage = document.querySelector('.stage'),
    increase = Math.PI * 2 / familySize,
    angle = 0,
    x = 0,
    y = 0;
    //console.log(ms);
  for( var i = 0; i < familySize; i++ ) {
    var p = new Plot( stage );
    p.setDimensions( picSize, picSize, 'vmin');
    p.setBackground(i+1);
    x = plotRadius * Math.cos( angle ) + centerX;
    if (x<centerX) x+=5; else x-=5;
    x = Math.max(2, Math.min(x, 40));
    y = plotRadius * Math.sin( angle ) + centerY;
    p.position( centerX,centerY );
    animateMe(p, x,y);
    angle += increase;
    // plot_user(msid[i]);
    $jDiv = $("<div>", {class: "message col-xs-6"})
    .html($("<div>", {class: "talkbubble", style: "background-color: " + colors[ms[i+1]]}));
    // $("#" + (i+1)).append($jDiv);
    render_msg(i+1, (ms[i+1]=='house')?"HOME":"", "normal");
  }


}


//console.log(ms);
distribute_users();

// var declare_users = function(){
// 	var house=0;
// 	for (var i=0; i<msid.length; i++){
// 		if (ms[msid[i]]=='house') {
// 			house = i;
// 			continue;
// 		}
// 		render_user(msid[i]);
// 	}
// 	render_user(msid[house]);
// }

// declare_users();




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
};

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
			    $(this).find('.qtime').html(calcSpan(dtime));
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
	/*
	sum = 0;
	sum1 = 0;
	for (var i = 0; i < cnt; i++) {
		if(atms[i] != 'normal' && atms[i] != 'happy') {
			sum ++;
		}
		else {
			sum1 ++;
		}
	}
	if (sum > cnt/2) {
		num = Math.floor((Math.random() * (images.length - 1)) + 1);
		// $(document.body).css('background-image', 'url(' + images[num] + ')');
		//move_character();
		home_msg_sad();
	}
	else if (sum1 == cnt) {
		home_msg_happy();
	}
	atms = [];
	*/
	for (var i = 0; i < cnt; i++) {
		if (atms[i] && atms[i+1]) {
			var t = atms[i];
			var tmp = t.split('.');
			//console.log(tmp);
			user1 = tmp[0];
			emotion1 = tmp[1];
			var t1 = atms[i+1];
			var tmp1 = t1.split('.');
			user2 = tmp1[0];
			emotion2 = tmp1[1];
			if ((user1 == 'dad' || user1 == 'mom') && (user2 == 'mom' || user2 == 'dad')) {
				score = 0;
				score += emotion_score[emotion1] + emotion_score[emotion2];
				if (score < 2) {
					home_msg_sad();
					atms = [];
				}
				else if (score > 2) {
					home_msg_happy();
					atms = [];
				}
			}
		}
	}
}, 100);

function move_character() {
	character = $('#character');
	character.animate({opacity: 1}, 1);
	character.animate({left: "-=1550px"}, 7000);
	character.animate({left: "+=1550px"}, 1);
	character.animate({opacity: 0.01}, 1);
}


function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344; };
    if (unit=="N") { dist = dist * 0.8684; };
    return dist;
}





function showPosition(position) {
	//console.log("Location: " + my_place);
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


$('#6').click(function(){
	$('.home-modal-lg').modal();
	// $('#temps').html(13);
	$tmp = $("#" + familySize + "div >img");
	//console.log($tmp);
	HomeTempPlot();

});

var light_status = 0;
$('#home_light').click(function(){
	console.log("light Clicked");
	$.get('http://10.10.0.209:8000/api/action1');

	// hue toggle
	if (light_status == 0){
		// ON
		light_toggle(true, 254, 40000); // white
		light_status = 1;
	} else {
		light_toggle(false, 254, 40000);
		light_status = 0;
	}

	pic = msid[familySize - 1];
	$tmp = $("#" + pic).find('div>img');
	$tmp.attr('src', 'static/img/house_happy.png');
	//console.log("id: ", pic, "tmp: ", $tmp);
	setTimeout(function(){
		$tmp.attr('src', 'static/img/house_normal.png');
	}, 5000);
});


$('#3').click(function(){
	//console.log("grandpa clicked");
	$('.grandpa-modal').modal();

});

function home_msg_sad() {
	 msg_senti = "皆元気出して、お仕事、お勉強頑張ろう!";
	light_toggle(true, 254, 20000); // yellow
	 render_msg(6, msg_senti, 'sad', 'home');
}

function home_msg_happy() {
	msg_senti = "皆今日元気だね！嬉しい！";
	light_toggle(true, 254, 6000); // red
	render_msg(6, msg_senti, 'happy', 'home');
}

function light_toggle(on, sat, hue){
	var data = '{"on":' + on + ', "sat":' + sat + ',"bri":254,"hue":' + hue + '}'
	$.ajax({
			"url" : "http://192.168.2.2/api/31a88c2e125b55271ac3b4218f9bf4b/lights/2/state",
			"data" : data,
			"success" : function() {},
			"type" : "PUT",
			"cache" : false,
			"error" : function() {},
			"dataType" : "json"
		});
}
