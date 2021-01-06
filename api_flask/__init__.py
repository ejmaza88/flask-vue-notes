import json

from flask import Flask, render_template, jsonify

from api_flask.config import Config
from api_flask.data import app_data


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_class)

    with app.app_context():

        # views
        @app.route('/')
        def index():
            return render_template('index.html')

        @app.route('/api/get-data/')
        def get_data_api():
            return jsonify(app_data)

        return app
