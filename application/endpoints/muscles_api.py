import json
import os

import application.database.db_connector as db
import MySQLdb
from application import app
from flask import Response, jsonify, request


# Routes
@app.route('/muscles-api', methods=['GET', 'POST'])
def muscles_api():
    db_connection = db.connect_to_database()
    if request.method == 'GET':
        query = """
                SELECT 
                    m.muscle_id,
                    m.muscle_name,
                    mg.muscle_group_name
                FROM 
                    muscles m
                LEFT JOIN
                    muscle_groups mg
                ON m.muscle_group = mg.muscle_group_id;
                """
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        fetched_data = cursor.fetchall()
        muscle_data = json.dumps(
            fetched_data
        )
        return muscle_data

    if request.method == 'POST':
        muscle_data = request.get_json()
        print("!" * 48)
        print(muscle_data)
        print("!" * 48)
        muscle_name = muscle_data['muscle_name']
        muscle_group = muscle_data['muscle_group']

        query = '''
            INSERT INTO
                MUSCLES(muscle_name, muscle_group)
            VALUES
                (%s,(SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=%s))
        '''
        args = (muscle_name,muscle_group)  # Enforce the tuple with comma
        
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

@app.route('/muscles-api', methods=['PUT'])
def update_muscles():
    db_connection = db.connect_to_database()
    muscle_data = request.get_json()
    muscle_name = muscle_data['muscle_name']
    muscle_group = muscle_data['muscle_group']
    muscle_id = muscle_data['muscle_id']
    print("!" * 48)
    print(muscle_data)
    print("!" * 48)
    query = '''
        UPDATE
            MUSCLES
        SET
            muscle_name = %s,
            muscle_group = (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=%s)
        WHERE
            muscle_id = %s
    '''
    args = (muscle_name,  muscle_group, muscle_id)

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

@app.route('/muscles-api', methods=['DELETE'])
def delete_muscles():
    db_connection = db.connect_to_database()
    muscle_id = request.get_json()['muscle_id']
    query = '''
        DELETE FROM
            MUSCLES
        WHERE
            muscle_id = %s 
    '''
    args = (muscle_id,)
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
