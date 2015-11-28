from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin

from chat import app
from .utils import mood

class ChatNamespace(BaseNamespace, RoomsMixin, BroadcastMixin):
    nicknames = []

    def initialize(self):
        self.logger = app.logger
        self.log("Socketio session started")

    def log(self, message):
        self.logger.info("[{0}] {1}".format(self.socket.sessid, message))

    def on_join(self, room):
        self.room = room
        self.join(room)
        return True

    def on_nickname(self, nickname):
        self.log('Nickname: {0}'.format(nickname))
        self.nicknames.append(nickname)
        self.session['nickname'] = nickname
        self.broadcast_event('announcement', '%s has connected' % nickname)
        self.broadcast_event('nicknames', self.nicknames)
        return True, nickname

    def recv_disconnect(self):
        # Remove nickname from the list.
        self.log('Disconnected')
        nickname = self.session['nickname']
        self.nicknames.remove(nickname)
        self.broadcast_event('announcement', '%s has disconnected' % nickname)
        self.broadcast_event('nicknames', self.nicknames)
        self.disconnect(silent=True)
        return True

    def on_user_message(self, msg):
        msg_mood = mood(msg)
        self.log('User message mood: {0}'.format(msg_mood))
        self.emit_to_room_including_self(self.room, 'msg_to_room', self.session['nickname'], msg, msg_mood)
        return True


    # helper mothods #
    def emit_to_room_including_self(self, room, event, *args):
        """This is sent to all in the room (in this particular Namespace) including self"""
        pkt = dict(type="event",
                   name=event,
                   args=args,
                   endpoint=self.ns_name)
        room_name = self._get_room_name(room)
        for sessid, socket in self.socket.server.sockets.iteritems():
            if 'rooms' not in socket.session:
                continue
            if room_name in socket.session['rooms']:
                socket.send_packet(pkt)


# def recv_data(self, data):
    #     # Send sensor data.
    #     self.log('User data: {0}'.format(data))
    #     self.sensor_data.append(data);
    #     self.emit_to_room(self.room, 'sensor_data',
    #                       self.session['nickname'], data)
    #     return True
