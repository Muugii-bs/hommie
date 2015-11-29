from sqlalchemy.engine import reflection
from sqlalchemy import create_engine
from sqlalchemy.schema import (
    MetaData,
    Table,
    DropTable,
    ForeignKeyConstraint,
    DropConstraint,
    )

from chat.models import Family, User, UserType, Sensor, SensorType, SensorValue
from chat.utils import get_current_time
from datetime import timedelta
import math
from random import randint


def drop_all_tables():

    engine = create_engine('sqlite:////tmp/chat.db')

    conn = engine.connect()

    # the transaction only applies if the DB supports
    # transactional DDL, i.e. Postgresql, MS SQL Server
    trans = conn.begin()

    inspector = reflection.Inspector.from_engine(engine)

    # gather all data first before dropping anything.
    # some DBs lock after things have been dropped in
    # a transaction.

    metadata = MetaData()

    tbs = []
    all_fks = []

    for table_name in inspector.get_table_names():
        fks = []
        for fk in inspector.get_foreign_keys(table_name):
            if not fk['name']:
                continue
                fks.append(
                    ForeignKeyConstraint((),(),name=fk['name'])
                )
        t = Table(table_name,metadata,*fks)
        tbs.append(t)
        all_fks.extend(fks)

    for fkc in all_fks:
        conn.execute(DropConstraint(fkc))

    for table in tbs:
        conn.execute(DropTable(table))

    trans.commit()


def create_defaults(db):
    family = Family(name='Suzuki Family', admin_user_id=1, home_lat=35.6597839, home_long=139.6770864)
    family.save()

    user_types = ['dad', 'mom', 'grandpa', 'son', 'daughter', 'house']
    i = 0
    for type_name in user_types:
        user_type = UserType(typename=type_name)
        db.session.add(user_type)
        db.session.commit()

        if i <= 1:
            # work
            work_lat = 35.5969408
            work_long = 139.67262
        elif i == 3 or i == 4:
            # school
            work_lat = 35.7085195
            work_long = 139.7568903
        else:
            # home
            work_lat = 35.6597839
            work_long = 139.6770864

        user = User(name='{} Suzuki'.format(type_name), email='{}@gmail.com'.format(type_name),
                    type_id=user_type.id, family_id=1, password='hommee', status_code=1,
                    work_lat=work_lat, work_long=work_long)
        db.session.add(user)
        db.session.commit()
        i += 1

    i = 0
    sensor_types = ['temperature', 'humidity', 'motion']
    for type_name in sensor_types:
        sensor_type = SensorType(typename=type_name)
        db.session.add(sensor_type)
        db.session.commit()

        sensor = Sensor(name='Livingroom {}'.format(sensor_type), owner_user_id=6, type_id=sensor_type.id)
        db.session.add(sensor)
        db.session.commit()

        # 24 hour data per every 10 min
        now = get_current_time()
        for j in range(0, 1440, 10):
            timestamp = now - timedelta(minutes=j)
            m = timestamp.hour * 60 + timestamp.minute
            x = (m - 240) * math.pi / 720
            if i == 0:
                v = 15 + 5 * math.cos(x)
            elif i == 1:
                v = 50 - 20 * math.cos(x)
            else:
                if timestamp.hour >= 15 and timestamp.hour <= 21:
                    v = 0
                else:
                    v = randint(0, 200)
            sv = SensorValue(value=str(v), timestamp=timestamp, sensor_id=sensor.id)
            db.session.add(sv)
        db.session.commit()
        i += 1
