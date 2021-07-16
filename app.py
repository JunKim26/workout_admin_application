import os

from flask import Flask, render_template

from sample_data import people_from_app_py

# Configuration

app = Flask(__name__)

# Routes

@app.route('/')
def root():
    return render_template("main.j2", people=people_from_app_py)

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9112))
    app.run(port=port, debug=True)
