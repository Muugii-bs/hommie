from flask import Response, request, render_template, url_for, redirect
from socketio import socketio_manage

from chat import app, db
from .models import Family, Sensor, SensorValue
from .namespaces import ChatNamespace
from .utils import get_object_or_404, get_or_create, get_current_time

@app.route('/')
def rooms():
    """
    Homepage - lists all rooms.
    """
    context = {"rooms": Family.query.all()}
    return render_template('rooms.html', **context)


@app.route('/<path:slug>')
def room(slug):
    """
    Show a room.
    """
    # context = {"room": get_object_or_404(ChatRoom, slug=slug)}
    context = {"room": get_object_or_404(Family, slug=slug)}
    # todo: check privelege
    return render_template('room.html', **context)


@app.route('/create', methods=['POST'])
def create():
    """
    Handles post from the "Add room" form on the homepage, and
    redirects to the new room.
    """
    name = request.form.get("name")
    if name:
        room, created = get_or_create(Family, name=name)
        return redirect(url_for('room', slug=room.slug))
    return redirect(url_for('rooms'))


@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    try:
        # socketio_manage(request.environ, {'/chat': ChatNamespace}, request)
        socketio_manage(request.environ, {'/chat': ChatNamespace}, request)
    except:
        app.logger.error("Exception while handling socketio connection",
                         exc_info=True)
    return Response()


@app.route('/api/sensor_value', methods=['POST'])
def api_sensor_value():
    """
    Handles post from the sensors.
    """
    app.logger.error("sensor_value request: {}".format(request.form))

    sensor_id = request.form.get("sensor_id")
    value = request.form.get("value")
    if sensor_id and value:
        sensor = get_object_or_404(Sensor, id=int(sensor_id))
        sv = SensorValue(value=value, timestamp=get_current_time(), sensor_id=sensor.id)
        db.session.add(sv)
        db.session.commit()
    return ('', 204)
