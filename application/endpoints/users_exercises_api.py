import json
import os

import application.database.db_connector as db
import MySQLdb
from application import app
from application.endpoints.utilities import convert_decimals_to_string
from flask import jsonify, request


# Routes
@app.route('/users-exercises-api', methods=['GET', 'POST'])
def users_exercises_api():
    db_connection = db.connect_to_database()
    if request.method == 'GET':
        query = """
            SELECT
                u.user_id,
                e.exercise_id,
                user_name,
                exercise_name,
                weight,
                set_count,
                rep_count,
                eq.equipment_name
            FROM
                EQUIPMENTS eq
            RIGHT JOIN
                EXERCISES e ON eq.equipment_id = e.equipment_required
            INNER JOIN
                USERS_EXERCISES ue ON e.exercise_id = ue.exercise_id
            RIGHT JOIN
                USERS u ON ue.user_id = u.user_id
        """
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        fetched_data = cursor.fetchall()
        json_data = json.dumps(
            fetched_data,
            default = convert_decimals_to_string
        )
        return json_data
    
    if request.method == 'POST':
        request_data = request.get_json()
        user_name = request_data['user_name']
        exercise_name = request_data['exercise_name']
        weight = request_data['weight']
        set_count = request_data['set_count']
        rep_count = request_data['rep_count']
        query = '''
            INSERT INTO USERS_EXERCISES
                (user_id, exercise_id)
            VALUES
                (
                    (SELECT user_id FROM USERS WHERE user_name=%s),
                    (
                        SELECT
                            exercise_id
                        FROM
                            EXERCISES
                        WHERE
                            exercise_name = %s AND
                            weight = %s AND
                            set_count = %s AND
                            rep_count = %s
                    )
                );
        '''
        args = (
            user_name,
            exercise_name,
            weight,
            set_count,
            rep_count
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

@app.route('/users-exercises-api', methods=['PUT'])
def update_users_exercises_api():
    db_connection = db.connect_to_database()
    muscle_group_data = request.get_json()
    muscle_group_name = muscle_group_data['muscle_group_name']
    muscle_group_id = muscle_group_data['muscle_group_id']
    query = '''
        UPDATE
            MUSCLE_GROUPS
        SET
            muscle_group_name = %s
        WHERE
            muscle_group_id = %s
    '''
    args = (muscle_group_name, muscle_group_id)

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

@app.route('/users-exercises-api', methods=['DELETE'])
def delete_users_exercises_api():
    db_connection = db.connect_to_database()
    request_data = request.get_json()
    user_id = request_data['user_id']
    exercise_id = request_data['exercise_id']
    query = '''
        DELETE FROM
            USERS_EXERCISES
        WHERE
            user_id = %s AND
            exercise_id = %s
    '''
    args = (user_id, exercise_id)
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
