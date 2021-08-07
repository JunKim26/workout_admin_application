import json
import os

import application.database.db_connector as db
import MySQLdb
from application import app
from application.endpoints.utilities import convert_decimals_to_string
from flask import jsonify, request


# Routes
@app.route('/exercises-api', methods=['GET', 'POST'])
def exercises_api():
    db_connection = db.connect_to_database()
    if request.method == 'GET':
        query = '''
            SELECT
                exercise_id,
                exercise_name,
                weight, 
                set_count,
                rep_count,
                equipment_name
            FROM
                EXERCISES e
                LEFT JOIN
                    EQUIPMENTS eq 
                ON e.equipment_required = eq.equipment_id
        '''
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        fetched_data = cursor.fetchall()
        exercise_data = json.dumps(
            fetched_data,
            default = convert_decimals_to_string
        )
        return exercise_data
    
    if request.method == 'POST':
        exercise_data = request.get_json()
        print(exercise_data)
        exercise_name = exercise_data['exercise_name']
        weight = exercise_data['weight']
        set_count = exercise_data['set_count']
        rep_count = exercise_data['rep_count']
        equipment_required = exercise_data['equipment_required']
        query = '''
            INSERT INTO
                EXERCISES(
                    exercise_name,
                    weight,
                    set_count,
                    rep_count,
                    equipment_required
                )
            VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s, 
                    (SELECT equipment_id FROM EQUIPMENTS WHERE equipment_name=%s)
                )
        '''
        args = (
            exercise_name,
            weight,
            set_count,
            rep_count,
            equipment_required
        )
        
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

@app.route('/exercises-api', methods=['PUT'])
def update_exercises_api():
    db_connection = db.connect_to_database()
    exercise_data = request.get_json()
    exercise_name = exercise_data['exercise_name']
    weight = exercise_data['weight']
    set_count = exercise_data['set_count']
    rep_count = exercise_data['rep_count']
    equipment_required = exercise_data['equipment_required']
    exercise_id = exercise_data['exercise_id']
    print("!" * 48)
    print(exercise_data)
    print("!" * 48)
    query = '''
        UPDATE
            EXERCISES
        SET
            exercise_name = %s,
            weight = %s,
            set_count = %s,
            rep_count = %s,
            equipment_required = (
                SELECT
                    equipment_id
                FROM
                    EQUIPMENTS
                WHERE
                    equipment_name=%s
            )
        WHERE
            exercise_id = %s
    '''
    args = (
        exercise_name,
        weight,
        set_count,
        rep_count,
        equipment_required,
        exercise_id
    )

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

@app.route('/exercises-api', methods=['DELETE'])
def delete_exercises_api():
    db_connection = db.connect_to_database()
    exercise_id = request.get_json()['exercise_id']
    query = '''
        DELETE FROM
            EXERCISES
        WHERE
            exercise_id = %s 
    '''
    args = (exercise_id,)
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
