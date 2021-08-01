import os

from flask import Flask
from flask_cors import CORS

# Configuration
app = Flask(__name__)
CORS(app)

# API endpoints
import application.endpoints.equipments
import application.endpoints.muscle_groups
import application.endpoints.muscles
import application.endpoints.users

# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
