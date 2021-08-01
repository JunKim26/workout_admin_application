import os

from flask import Flask

# Configuration
app = Flask(__name__)

# routes
import application.views.muscle_groups
import application.views.users

# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
