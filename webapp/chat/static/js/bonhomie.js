var total = 0;
// var types = ["grandma", "dad", "mom", "son", "daughter"];
var emos = ["angry", "sad", "happy", "normal", "scared"];
var colors = ["#B4E0DC", "#1DAFEC", "#9CD09C", "#A18981", "#F3896B"];
var atms = []
var images = ["static/img/winter_wp1.jpg", "static/img/winter_wp2.jpg", "static/img/winter_wp3.jpg", "static/img/summer_wp1.jpg", "static/img/summer_wp2.png", "static/img/summer_wp3.jpg"];


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
	render_msg(user, "Hello", "normal");
}

var render_msg = function (user, msg, emotion){

	atms.push(emotion);
	if (user=='System' || user=='undefined'){
		return;
	}
	$("#" + user).find("div .qtime").remove();
	$('#lines').append($('<p>').append('<b>' + ms[user] + ': </b>').append($('<em>').text(msg)));
	tag = (new Date()).getTime();
	$span = $("<span tag='" + tag + "'>").html(msg+"<br/>");
	$("#" + user + " .message > div").append($span);
	if (emotion) $("#" + user +"> div>img").attr('src','static/img/'+ms[user]+'_' + emotion+'.png');
}

var declare_users = function(){
	for (var i=0; i<msid.length; i++)
		render_user(msid[i]);
}

declare_users();
// for (var i=1; i<6; i++)
// 	render_user(i);

var showTime = function(e, t){
	var qtime = new Date(parseInt(t));
	$qp = $("<div>", {class: 'qtime', style:'font-size:8px; font-strech:condensed'}).html(qtime.toString());
	e.append($qp);
}

window.setInterval(function(){
	$(".message").each(function(){
		var messageTotal = $(this).find("div>span").length;
		var user = $(this).parent().attr('id');
		if (messageTotal ==1){
			if ($(this).find('.qtime').length==0)
				showTime($(this).find('div'),$(this).find('span').get(0).getAttribute('tag'));
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
	}
	atms = [];

}, 10000);

move_character();

function move_character() {
	character = $("#character").fadeIn();
	character.moveTo(150, 150);
	character.focus();
	character.moveTo(75, 50);
	character.focus();
	character.fadeOut();
}
