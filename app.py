from flask import Flask, jsonify, send_from_directory

from plan_data import PLAN

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/plan")
def plan():
    return jsonify(PLAN)


if __name__ == "__main__":
    app.run(debug=True, port=5050)
