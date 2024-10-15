from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
uri = "mongodb://" + os.getenv("DB_CONN") + "@" + os.getenv("MONGO_DB_IP") + ":27017/?authSource=admin&tls=true&tlsAllowInvalidCertificates=true"
client = MongoClient(uri)
db = client.TestDB

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({"username": data['username'], "password": data['password']})
    if user:
        return jsonify({"success": True, "role": user['role']}), 200
    return jsonify({"success": False}), 401

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    announcements = list(db.announcements.find())
    return jsonify([{
        "id": str(ann["_id"]),
        "text": ann["text"],
        "date": ann["date"]
    } for ann in announcements]), 200
@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = list(db.scores.find())
    return jsonify([{
        "id": str(score["_id"]),
        "student": score["student"],
        "subject": score["subject"],
        "score": score["score"]
    } for score in scores]), 200

@app.route('/api/questions', methods=['POST'])
def add_question():
    question_data = request.json
    result = db.questions.insert_one(question_data)
    return jsonify({"success": True, "id": str(result.inserted_id)}), 201

@app.route('/questions', methods=['GET'])
def get_questions():
    questions = list(db.questions.find())
    return jsonify([{
        "id": str(q["_id"]),
        "text": q["text"],
        "options": q["options"],
        "correctAnswer": q["correctAnswer"],
        "media": q["media"]
    } for q in questions]), 200

if __name__ == '__main__':
    app.run()