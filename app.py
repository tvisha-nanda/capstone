import json
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")

PLAN_PATH = Path(__file__).parent / "plan_data.json"


def load_plan():
    with open(PLAN_PATH) as f:
        return json.load(f)


def save_plan(plan):
    with open(PLAN_PATH, "w") as f:
        json.dump(plan, f, indent=2)


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/plan")
def plan_page():
    return send_from_directory(app.static_folder, "plan.html")


@app.route("/api/plan", methods=["GET"])
def get_plan():
    return jsonify(load_plan())


@app.route("/api/plan", methods=["PUT"])
def put_plan():
    plan = request.get_json(force=True)
    if not isinstance(plan, list):
        return jsonify({"error": "expected a list of terms"}), 400
    for term in plan:
        if not isinstance(term, dict) or "term" not in term or "courses" not in term:
            return jsonify({"error": "each term needs 'term' and 'courses'"}), 400
    save_plan(plan)
    return jsonify(plan)


if __name__ == "__main__":
    app.run(debug=True, port=5050)
