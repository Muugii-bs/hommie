$(function() {

    var WEB_SOCKET_SWF_LOCATION = '/static/js/socketio/WebSocketMain.swf',
        socket = io.connect('/chat');

    socket.on('connect', function () {
        $('#chat').addClass('connected');
        socket.emit('join', window.room);
    });

    socket.on('announcement', function (user) {
        //$('#lines').append($('<p>').append($('<em>').text(msg)));
        render_msg(user.substring(0,1), "Logged In");
    });

    socket.on('nicknames', function (nicknames) {
        /*$('#nicknames').empty().append($('<span>Online: </span>'));
        for (var i in nicknames) {
          $('#nicknames').append($('<b>').text(nicknames[i]));
        }*/
		// declare_users(nicknames);
    });

	socket.on('sensor_data', function (nickname, data) {
		render_data(nickname, data);
	});

    socket.on('msg_to_room', function (nickname, msg, emotion) {
		render_msg(nickname, msg, emotion);	
	});

    socket.on('reconnect', function () {
        //$('#lines').remove();
		reconnect();
        render_msg('System', 'Reconnected to the server', '');
    });

    socket.on('reconnecting', function () {
        render_msg('System', 'Attempting to re-connect to the server', '');
    });

    socket.on('error', function (e) {
        render_msg('System', e ? e : 'A unknown error occurred', '');
    });
	
    // DOM manipulation
    $(function () {
        var user = Math.floor((Math.random() * 6) + 1);
        $("#nick").val(user);

        $('#set-nickname').submit(function (ev) {
            socket.emit('nickname', user, function (set) {
                if (set) {
                    clear();
                    return $('#chat').addClass('nickname-set');
                }
                $('#nickname-err').css('visibility', 'visible');
            });
            return false;
        });

        $('#send-message').submit(function () {

            render_msg(user, $('#message').val());
            // message('me', $('#message').val());
            socket.emit('user message', $('#message').val());
            clear();
            $('#lines').get(0).scrollTop = 10000000;
            return false;
        });

        function clear () {
            $('#message').val('').focus();
        }
    });

});
