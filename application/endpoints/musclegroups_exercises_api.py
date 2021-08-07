import json
import os

import application.database.db_connector as db
import MySQLdb
from application import app
from application.endpoints.utilities import convert_decimals_to_string
from flask import jsonify, request


# Routes
@app.route('/muscle-groups-exercises-api', methods=['GET', 'POST'])
def musclegroups_exercises_api():
    db_connection = db.connect_to_database()
    if request.method == 'GET':
        # query = "SELECT * FROM MUSCLEGROUPS_EXERCISES"
        query = """
            SELECT
                e.exercise_id,
                mg.muscle_group_id,
                muscle_group_name,
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
                MUSCLEGROUPS_EXERCISES me ON e.exercise_id = me.exercise_id
            INNER JOIN
                MUSCLE_GROUPS mg ON me.muscle_group_id = mg.muscle_group_id
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
        muscle_group_name = request_data['muscle_group_name']
        exercise_name = request_data['exercise_name']
        weight = request_data['weight']
        set_count = request_data['set_count']
        rep_count = request_data['rep_count']
        query = '''
            INSERT INTO MUSCLEGROUPS_EXERCISES
                (muscle_group_id, exercise_id)
            VALUES
                (
                    (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=%s),
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
            muscle_group_name,
            exercise_name,
            weight,
            set_count,
            rep_count
        )  # Enforce the tuple with comma
        
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

@app.route('/muscle-groups-exercises-api', methods=['PUT'])
def update_musclegroups_exercises_api():
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

@app.route('/muscle-groups-exercises-api', methods=['DELETE'])
def delete_musclegroups_exercises_api():
    db_connection = db.connect_to_database()
    request_data = request.get_json()
    muscle_group_id = request_data['muscle_group_id']
    exercise_id = request_data['exercise_id']
    query = '''
        DELETE FROM
            MUSCLEGROUPS_EXERCISES
        WHERE
            muscle_group_id = %s AND
            exercise_id = %s
    '''
    args = (muscle_group_id, exercise_id)
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
