$(function() {

    var WEB_SOCKET_SWF_LOCATION = '/static/js/socketio/WebSocketMain.swf',
        socket = io.connect('/chat');	

	var users = [];

    socket.on('connect', function () {
        $('#chat').addClass('connected');
        socket.emit('join', window.room);
    });

    socket.on('announcement', function (user) {
		//render_user();
		var total=1;
		var UserBox = React.createClass({
		  render: function() {
			total++;
			var side = (total%2==1) ? 'left': 'right';
			var sideDiv = 'col-xs-6 pull-' + side;
			var sideMessage = 'talkbubble ' + side;
			var userID = total;
			return (
			  React.createElement('div', {className: sideDiv,},
				React.createElement('div', {className: "col-xs-6"},
					<img class="img-responsive" src="static/img/dad.png" style={{width: 100}}/>
				),
				React.createElement('div', {className: "message col-xs-6"},
					React.createElement('p', {className: sideMessage}, "Hello, I'm dad")
				)
			  )
			);
		  }
		});
		ReactDOM.render(<UserBox />, document.getElementById('content'));

		users.push(user);
    });

	socket.on('sensor_data', function (user, data) {
		render_data(user, data);
	});

    socket.on('nicknames', function (nicknames) {
		declare_users(nicknames);
		users = nicknames;
        /*$('#nicknames').empty().append($('<span>Online: </span>'));
        for (var i in nicknames) {
          $('#nicknames').append($('<b>').text(nicknames[i]));
        }*/
    });

    socket.on('msg_to_room', function (user, msg) {
		render_msg(user, msg, emotion);
	});

    socket.on('reconnect', function () {
        //$('#lines').remove();
        render_msg('System', 'Reconnected to the server');
		reconnect();
    });

    socket.on('reconnecting', function () {
        render_msg('System', 'Attempting to re-connect to the server');
    });

    socket.on('error', function (e) {
        render_msg('System', e ? e : 'A unknown error occurred');
    });

    /*function message (from, msg) {
        $('#lines').append($('<p>').append($('<b>').text(from), msg));
    }*/

    // DOM manipulation
    $(function () {
        $('#set-nickname').submit(function (ev) {
            socket.emit('nickname', $('#nick').val(), function (set) {
                if (set) {
                    clear();
                    return $('#chat').addClass('nickname-set');
                }
                $('#nickname-err').css('visibility', 'visible');
            });
            return false;
        });

        $('#send-message').submit(function () {
            render_msg('me', $('#message').val());
            socket.emit('user message', $('#message').val());
            clear();
            $('#lines').get(0).scrollTop = 10000000;
            return false;
        });

        function clear () {
            $('#message').val('').focus();
        }
    });

	function render_user() {
			}
		
    //render_user();	

});
