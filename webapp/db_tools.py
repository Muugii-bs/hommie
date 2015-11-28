from sqlalchemy.engine import reflection
from sqlalchemy import create_engine
from sqlalchemy.schema import (
    MetaData,
    Table,
    DropTable,
    ForeignKeyConstraint,
    DropConstraint,
    )

from chat.models import Family, User, UserType, Sensor, SensorType

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
    family = Family(name='Suzuki Family', admin_user_id=1)
    family.save()

    user_types = ['dad', 'mom', 'grandpa', 'son', 'daughter', 'house']
    for type_name in user_types:
        user_type = UserType(typename=type_name)
        db.session.add(user_type)
        db.session.commit()

        user = User(name='{} Suzuki'.format(type_name), email='{}@gmail.com'.format(type_name),
                    type_id=user_type.id, family_id=1)
        db.session.add(user)
        db.session.commit()

    sensor_types = ['temperature', 'humidity', 'motion']
    for type_name in sensor_types:
        sensor_type = SensorType(typename=type_name)
        db.session.add(sensor_type)
        db.session.commit()

        sensor = Sensor(name='Livingroom {}'.format(sensor_type), owner_user_id=6, type_id=sensor_type.id)
        db.session.add(sensor)
        db.session.commit()
