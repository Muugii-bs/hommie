from flask import Response, request, render_template, url_for, redirect
from socketio import socketio_manage

from chat import app
from .models import ChatRoom, ChatUser
from .namespaces import ChatNamespace
from .utils import get_object_or_404, get_or_create

@app.route('/')
def rooms():
    """
    Homepage - lists all rooms.
    """
    context = {"rooms": ChatRoom.query.all()}
    return render_template('rooms.html', **context)


@app.route('/<path:slug>')
def room(slug):
    """
    Show a room.
    """
    context = {"room": get_object_or_404(ChatRoom, slug=slug)}
    return render_template('room.html', **context)


@app.route('/create', methods=['POST'])
def create():
    """
    Handles post from the "Add room" form on the homepage, and
    redirects to the new room.
    """
    name = request.form.get("name")
    if name:
        room, created = get_or_create(ChatRoom, name=name)
        return redirect(url_for('room', slug=room.slug))
    return redirect(url_for('rooms'))


@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    try:
        socketio_manage(request.environ, {'/chat': ChatNamespace}, request)
    except:
        app.logger.error("Exception while handling socketio connection",
                         exc_info=True)
    return Response()
