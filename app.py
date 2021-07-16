import os

from flask import Flask, render_template

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
    return "This is the bsg-people route."

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
