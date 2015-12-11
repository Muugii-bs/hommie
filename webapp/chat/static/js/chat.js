$(function() {

    var WEB_SOCKET_SWF_LOCATION = '/static/js/socketio/WebSocketMain.swf',
        socket = io.connect('/chat');

    socket.on('connect', function () {
        $('#chat').addClass('connected');
        socket.emit('join', window.room);
    });

    socket.on('announcement', function (user) {
        //$('#lines').append($('<p>').append($('<em>').text(msg)));
        // render_msg(user.substring(0,1), "Logged In");
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

    socket.on('msg_to_room', function (nickname, msg, emotion, place) {
        render_msg(nickname, msg, emotion, place);
		// console.log(nickname + " " + msg + " " + emotion);
	});
    socket.on('user_message_feedback', function (nickname, msg, emotion, place) {
        render_msg(nickname, msg, emotion, place);
        // console.log(nickname + " " + msg + " " + emotion);
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

    $("#nick").val(user);

    //$('#set-nickname').submit(function (ev) {
    socket.emit('nickname', user, function (set) {
        if (set) {
            clear();
            $('#chat').addClass('nickname-set');
        }
        $('#nickname-err').css('visibility', 'visible');
    });
        //return false;
    //});

    $('#send-message').submit(function () {
        // render_msg($("#nick").val(), $('#message').val());
        // message('me', $('#message').val());
        socket.emit('user message', $('#message').val(), my_place);
        clear();
        $('#lines').get(0).scrollTop = 10000000;
        return false;
    });
    $("#messageButton").click(function(){
         console.log("Message" + my_place);
         socket.emit('user message', $('#message').val(), my_place);
         clear();
         $('#lines').get(0).scrollTop = 10000000;
    });

    // === HOME chat functions ===
    // function to check home message every second
    var home_last_msg_id = 0;
    setInterval(function(){
        socket.emit('home_get_message', home_last_msg_id);
    },1000);
    // if new message exists, server emits new message to this socket
    socket.on('msg_from_home', function (msg, emotion, msg_id) {
        home_last_msg_id = msg_id;
        render_msg('6', msg, emotion);
    });

    var clear = function () {
        $('#message').val('').focus();
    };
});
