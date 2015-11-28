var total = 0;
var types = ["grandma", "dad", "mom", "son", "daughter"];
var emos = ["angry", "sad", "happy", "normal", "scared"];
var colors = ["#B4E0DC", "#1DAFEC", "#9CD09C", "#A18981", "#F3896B"];

$qtable = $("<table>");
$qdiv = [];
for (var i=1; i<6; i++){
	$qa = $("<a>", {href:"#", id: "img"+i}).append($("<img>", {src: "static/img/"+types[i-1]+"_normal.png"}));
	$qa.click(function(){
		// console.log($(this).attr('id'));
	});
	$qdiv[i] = $("<div>", {class: "biliboard electronic col"+i})
		.append($qa);
}
$qtable.append($("<tr>", {style: "width:100%"})
	.append($("<td>").append($qdiv[1]))
	.append($("<td>").append($qdiv[2])))
.append($("<tr>", {style: "width:100%"})
	.append($("<td>").append($qdiv[3]))
	.append($("<td>").append($qdiv[4])))
.append($("<tr>", {style: "width:100%"})
	.append($("<td>").append($qdiv[5])));

// console.log($qtable);
// $("#modalTable").html($qtable);


var render_user = function(user){
	var bit = user%2;
	var side = bit ? 'left': 'right';
	var sideDiv = 'col-xs-6 pull-' + side; 
  	var sideMessage = 'talkbubble ' + side;

	var $div = [];
	var $person = $("<div>", {id: user, class: sideDiv});
	$div[0] = $("<div>", {class: "col-xs-6"})
	.html($("<img>", {class: "img-responsive"+(bit ?" flip":""),src:"static/img/"+types[user-1]+"_normal.png", style: "width: 100%;"}));
	$div[1] = $("<div>", {class: "message col-xs-6"})
		.html($("<p>", {class: sideMessage, style: "background-color: " + colors[user-1]}));
	$person.append($div[1-bit]).append($div[bit]);
	$("#people").append($person);
	render_msg(user, "Hello", "normal");
}

var render_msg = function (user, msg, emotion){
	$('#lines').append($('<p>').append('<b>' + types[user-1] + ': </b>').append($('<em>').text(msg)));
	if (user=='System'){
		// $('#lines').append($('<p>').append($('<em>').text(msg)));
		return;
	}
	tag = (new Date()).getTime();
	$span = $("<span tag='" + tag + "'>").html(msg+"<br/>");
	$("#" + user + " .message > p").append($span);
	if (emotion) $("#" + user +"> div>img").attr('src','static/img/'+types[(user-1)%5]+'_' + emotion+'.png');
}

var declare_users = function(users){
	for (var i=0; i<users.length; i++)
		render_user(users[i]);
}

for (var i=1; i<6; i++)
	render_user(i);

$("#butt").click(function(){
	var user = Math.floor((Math.random() * 6) + 1);
	render_msg(user, "asdasd", "normal");
});

window.setInterval(function(){
	// console.log("Cleaning");
	$(".message").each(function(){
		$(this).find("p>span").each(function(index){
		dtag = (new Date()).getTime();
		if (dtag - $(this).attr('tag') > 5000){
			$(this).fadeOut( "slow", function() {
				$(this).remove();
			});
		}

		});

	});
}, 1000);
