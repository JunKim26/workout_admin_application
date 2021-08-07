import os

from flask import Flask
from flask_cors import CORS

# Configuration
app = Flask(__name__)
CORS(app)

# API endpoints
import application.endpoints.equipments_api
import application.endpoints.muscle_groups_api
import application.endpoints.exercises_api
import application.endpoints.muscles_api
import application.endpoints.users_api
import application.endpoints.musclegroups_exercises_api
import application.endpoints.users_exercises_api
import application.endpoints.users_api

# views
import application.views

# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
