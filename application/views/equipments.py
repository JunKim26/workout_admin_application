import os
import MySQLdb

from flask import render_template, json, request

import application.database.db_connector as db

# create database connection
db_connection = db.connect_to_database()

from application import app

# Routes
@app.route('/equipments', methods=['GET', 'POST'])
def equipments():
    if request.method == 'GET':
        query = "SELECT * FROM EQUIPMENTS"
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        results = json.dumps(cursor.fetchall())
        return results
    
    if request.method == 'POST':
        equipment_name = request.form.get('equipment_name')
        query = '''
            INSERT INTO
                EQUIPMENTS(equipment_name)
            VALUES
                (%s)
        '''
        args = (equipment_name,)  # Enforce the tuple with comma
        
        try:
            cursor = db.execute_query(
                db_connection=db_connection,
                query=query,
                query_params=args
            )
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            print(e)
            return 'Insert unsuccessfull!'
        return 'Insert successfull!'

@app.route('/equipments', methods=['PUT'])
def update_equipments():
    equipment_name = request.form.get('equipment_name')
    equipment_id = request.form.get('equipment_id')
    query = '''
        UPDATE
            EQUIPMENTS
        SET
            equipment_name = %s
        WHERE
            equipment_id = %s
    '''
    args = (equipment_name, equipment_id)

    try:
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query,
            query_params=args
        )
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        print(e)
        return 'Update unsuccessfull!'
    return 'Update successfull!'

@app.route('/equipments', methods=['DELETE'])
def delete_equipment():
    equipment_id = request.form.get('equipment_id')
    query = '''
        DELETE FROM
            EQUIPMENTS
        WHERE
            equipment_id = %s 
    '''
    args = (equipment_id,)
    try:
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query,
            query_params=args
        )
    except (MySQLdb.Error, MySQLdb.Warning) as e:
        print(e)
        return 'Delete unsuccessfull!'
    return 'Delete successfull!'


# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
