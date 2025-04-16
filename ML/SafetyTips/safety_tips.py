from flask import Flask, request, jsonify
import google.generativeai as genai

# Set your Gemini API Key
genai.configure(api_key="AIzaSyAowT5semteJ5I0g2UcUyoisdMReOYYh6g")  # Replace with your real key

app = Flask(__name__)

# Maps
disaster_map = {0: "flood", 1: "cyclone", 2: "earthquake", 3: "landslide", 4: "heatwave"}
area_map = {0: "urban", 1: "suburban", 2: "rural"}

def build_prompt_from_data(data):
    disaster = disaster_map.get(data["disaster_type"], "disaster")
    wind_speed = data["wind_speed"]
    rainfall = data["rainfall"]
    flood_level = data["flood_level"]
    temperature = data["temperature"]
    population_density = data["population_density"]
    area = area_map.get(data["area_type"], "area")
    infra_score = data["infrastructure_score"]
    print(area)
    return (
        f"A {disaster} is affecting a {area} area. "
        f"Temperature is {temperature}°C, wind speed is {wind_speed} km/h, "
        f"rainfall is {rainfall} mm, flood level is {flood_level} cm. "
        f"The area has a population density of {population_density} people/km² "
        f"and an infrastructure score of {infra_score}/10. "
        f"Generate 3 to 4 short, high-priority safety tips for this situation. "
        f"Keep the response concise and under 5 lines, no formatting like bullets or markdown."
    )

@app.route('/generate-tip', methods=['POST'])
def generate_safety_tip():
    try:
        data = request.get_json()
        prompt = build_prompt_from_data(data)

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        cleaned_tip = ". ".join(response.text.split(". ")[:3]) + "."
        return jsonify({"safety_tip": cleaned_tip})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to generate tip"}), 500

if __name__ == '__main__':
    app.run(port=5003)
