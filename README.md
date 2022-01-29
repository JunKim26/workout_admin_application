# Workout Admin Application

To run this program in Windows using Powershell, please perform the following actions:

1. Clone the repository to a particular directory
2. Open Windows Powershell and cd to root of the directory
3. Create a virtual environment (example: python -m venv project_env)
4. Activate the virtual environment (example: project_env\Scripts\activate.ps1)
5. Run: python -m pip install -r requirements.txt
6. Run the following command: $env:FLASK_APP = "application"
7. Run the following command: $env:FLASK_ENV = "development"
8. Install the project to your virtual environment (run: python -m pip install -e . )
9. Create .env file for variables for database connection (see application/database/db_connector.py)
10. In MySQL database, load the ddq.sql file from application/database
11. Startup the Flask app with the command: flask run
