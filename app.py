import os

from flask import Flask, render_template, json

from sample_data import people_from_app_py
import database.db_connector as db

# create database connection
db_connection = db.connect_to_database()

# Configuration

app = Flask(__name__)

# Routes

@app.route('/')
def root():
    return render_template("main.j2", people=people_from_app_py)

@app.route('/bsg-people')
def bsg_people():
    query = "SELECT * FROM bsg_people"
    cursor = db.execute_query(db_connection=db_connection, query=query)
    results = cursor.fetchall()
    return render_template("bsg.j2", bsg_people=results)


# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
