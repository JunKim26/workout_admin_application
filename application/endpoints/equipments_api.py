import os

import application.database.db_connector as db
import MySQLdb
from application import app
from flask import jsonify, request


# Routes
@app.route('/equipments-api', methods=['GET', 'POST'])
def equipments_api():
    db_connection = db.connect_to_database()
    if request.method == 'GET':
        query = "SELECT * FROM EQUIPMENTS"
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        response = jsonify(cursor.fetchall())
        return response
    
    if request.method == 'POST':
        equipment_name = request.get_json()['equipment_name']
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
            return 'Insert unsuccessful!'

        return 'Insert successful!'

@app.route('/equipments-api', methods=['PUT'])
def update_equipment_api():
    db_connection = db.connect_to_database()
    equipment_data = request.get_json()
    equipment_name = equipment_data['equipment_name']
    equipment_id = equipment_data['equipment_id']
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

@app.route('/equipments-api', methods=['DELETE'])
def delete_equipments_api():
    db_connection = db.connect_to_database()
    equipment_id = request.get_json()['equipment_id']
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
