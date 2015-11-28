var total = 0;
var types = ["grandma", "dad", "mom", "son", "daughter"];
var emos = ["angry", "sad", "happy", "normal", "scared"];

$qtable = $("<table>");
$qdiv = [];
for (var i=1; i<6; i++){
	$qa = $("<a>", {href:"#", id: "img"+i}).append($("<img>", {src: "static/img/"+types[i-1]+".png"}));
	$qa.click(function(){
		console.log($(this).attr('id'));
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

console.log($qtable);
$("#modalTable").html($qtable);


var render_user = function(user){
	var bit = user%2;
	var side = bit ? 'left': 'right';
	var sideDiv = 'col-xs-6 pull-' + side; 
  	var sideMessage = 'talkbubble ' + side;

	var $div = [];
	var $person = $("<div>", {id: user, class: sideDiv});
	$div[0] = $("<div>", {class: "col-xs-6"})
		.html($("<img>", {class: "img-responsive", src:"static/img/dad.png", style: "width: 100%;"}));
	$div[1] = $("<div>", {class: "message col-xs-6"})
		.html($("<p>", {class: sideMessage}));
	$person.append($div[1-bit]).append($div[bit]);
	$("#people").append($person);
	render_message(user, "Hello");
}

var render_message = function (user, msg, emotion){
	tag = (new Date()).getTime();
	$span = $("<span tag='" + tag + "'>").html(msg+"<br/>");
	$("#" + user + " .message > p").append($span);
}

for (var i=1; i<6; i++)
	render_user(i);

$("#butt").click(function(){
	var user = Math.floor((Math.random() * 6) + 1);;
	render_message(user, "asdasd");
});

window.setInterval(function(){
	console.log("Cleaning");
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
