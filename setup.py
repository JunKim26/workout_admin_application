from setuptools import find_packages, setup

setup(
    name = 'application',
    packages = find_packages(),
    include_package_data = True,
    install_requires = [
        'flask',
        'Flask-MySQLdb',
        'python-dotenv',
        'flask-cors'
    ]
)