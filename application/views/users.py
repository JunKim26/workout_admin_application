import os
import MySQLdb

from flask import render_template, json, request

import application.database.db_connector as db

# create database connection
db_connection = db.connect_to_database()

from application import app

# Routes
@app.route('/users', methods=['GET', 'POST'])
def muscle_groups():
    if request.method == 'GET':
        query = "SELECT * FROM users"
        cursor = db.execute_query(
            db_connection=db_connection,
            query=query
        )
        results = json.dumps(cursor.fetchall())
        return results
    
    if request.method == 'POST':
        user_name = request.form.get('user_name')
        query = '''
            INSERT INTO
                USERS(user_name)
            VALUES
                (%s)
        '''
        args = (user_name,)  # Enforce the tuple with comma
        
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

@app.route('/users', methods=['PUT'])
def update_users():
    user_name = request.form.get('user_name')
    user_id = request.form.get('user_id')
    query = '''
        UPDATE
            USERS
        SET
            user_name = %s
        WHERE
            user_id = %s
    '''
    args = (user_name, user_id)

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

@app.route('/users', methods=['DELETE'])
def delete_users():
    user_id = request.form.get('user_id')
    query = '''
        DELETE FROM
            USERS
        WHERE
            user_id = %s 
    '''
    args = (user_id,)
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
