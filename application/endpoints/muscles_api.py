import os
import MySQLdb

from flask import render_template, json, request

import application.database.db_connector as db

# create database connection
db_connection = db.connect_to_database()

from application import app

# Routes
@app.route('/muscles-api', methods=['GET', 'POST'])
def muscles_api():
    if request.method == 'GET':
        query = "SELECT * FROM MUSCLES"
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        results = json.dumps(cursor.fetchall())
        return results
    
    if request.method == 'POST':
        muscle_name = request.form.get('muscle_name')
        muscle_group_FK = request.form.get('muscle_group_FK')
        query = '''
            INSERT INTO
                MUSCLES(muscle_name),
                MUSCLES(muscle_group_FK)
            VALUES
                (%s),
                (SELECT muscle_group_id FROM MUSCLE_GROUPS WHERE muscle_group_name=:muscle_group_name_input)
            
        '''
        args = (muscle_name,muscle_group_FK)  # Enforce the tuple with comma
        
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
def update_muscle_api():
    muscle_name = request.form.get('muscle_name')
    muscle_id = request.form.get('muscle_id')
    muscle_group_FK = request.form.get('muscle_group_FK')

    query = '''
        UPDATE
            MUSCLES
        SET
            muscle_name = %s
            muscle_group_FK = muscle_group_FK_input
        WHERE
            muscle_id = %s
    '''
    args = (muscle_name, muscle_id, muscle_group_FK)

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
def delete_muscles_api():
    muscle_id = request.form.get('muscle_id')
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