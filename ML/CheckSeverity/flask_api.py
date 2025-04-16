# flask_api.py
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('severity_model.pkl')

@app.route('/predict-severity', methods=['POST'])
def predict():
    data = request.json
    features = [
        data['disaster_type'],
        data['wind_speed'],
        data['rainfall'],
        data['flood_level'],
        data['temperature'],
        data['population_density'],
        data['area_type'],
        data['infrastructure_score']
    ]
    prediction = model.predict([features])[0]
    return jsonify({ "severity_index": int(prediction) })

if __name__ == '__main__':
    app.run(port=5002)

