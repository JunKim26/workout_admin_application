from flask import render_template

from application import app


# Routes
@app.route('/users', methods=['GET'])
def users():
    return render_template("users.html")

@app.route('/users-exercises', methods=['GET'])
def users_exercises():
    return render_template("users_exercises.html")

@app.route('/users-muscle-groups', methods=['GET'])
def users_muscle_groups():
    return render_template("users_musclegroups.html")

@app.route('/muscle-groups', methods=['GET'])
def muscle_groups():
    return render_template("muscle_groups.html")

@app.route('/muscle-groups-exercises', methods=['GET'])
def muscle_groups_exercises():
    return render_template("musclegroups_exercises.html")

@app.route('/exercises', methods=['GET'])
def exercises():
    return render_template("exercises.html")

@app.route('/muscles', methods=['GET'])
def muscles():
    return render_template("muscles.html")

@app.route('/equipments', methods=['GET'])
def equipments():
    return render_template("equipments.html")

