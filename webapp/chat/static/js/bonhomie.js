var total = 0;
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
		console.log(dtag - $(this).attr('tag'));
		if (dtag - $(this).attr('tag') > 5000){
			console.log($(this).attr('tag'));
			$(this).fadeOut( "slow", function() {
				$(this).remove();
			});
		}

		});

	});
}, 1000);
