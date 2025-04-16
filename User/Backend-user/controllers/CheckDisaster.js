const express = require("express");
const Disaster = require("../models/Disaster");
const Router = express.Router();
const haversine = require('haversine-distance');

Router.post("/checkDisaster", async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude)
        return res.status(400).json({ error: "Invalid coordinates" });

    let dist = 0
    try {
        const disasters = await Disaster.find({});
        for (let disaster of disasters) {
            
            dist = haversine(
                {
                    lat: latitude,
                    lon: longitude,
                },
                {
                    lat: disaster.latitude,
                    lon: disaster.longitude,
                },
                { unit: "km" } 
            );
            if (dist <= disaster.radius_km) { // User is in danger zone
                const severityPayload = {
                    disaster_type: disaster.disaster_type,
                    wind_speed: disaster.wind_speed,
                    rainfall: disaster.rainfall,
                    flood_level: disaster.flood_level,
                    temperature: disaster.temperature,
                    population_density: disaster.population_density,
                    area_type: disaster.area_type,
                    infrastructure_score: disaster.infrastructure_score
                };

                const flaskRes = await fetch('http://localhost:5002/predict-severity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(severityPayload)
                });
                if (!flaskRes.ok) throw new Error('Flask API call failed');

                const flaskData = await flaskRes.json();
                const severity_index = flaskData.severity_index;

                const {
                    disaster_type,
                    wind_speed,
                    rainfall,
                    flood_level,
                    temperature,
                    population_density,
                    area_type,
                    infrastructure_score
                } = disaster;
                const safetyTip = await fetch('http://localhost:5003/generate-tip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        disaster_type,
                        wind_speed,
                        rainfall,
                        flood_level,
                        temperature,
                        population_density,
                        area_type,
                        infrastructure_score
                    })
                });
                const safetyTipData = await safetyTip.json();
                return res.json({
                    alert: true,
                    disaster_type: disaster.disaster_type,
                    disaster_radius: disaster.radius_km,
                    severity_index: severity_index,
                    wind_speed: disaster.wind_speed,
                    rainfall: disaster.rainfall,
                    temperature: disaster.temperature,
                    severity_data: {
                        wind_speed: disaster.wind_speed,
                        flood_level: disaster.flood_level,
                        location_distance_km: dist,
                    },
                    safety_tip: safetyTipData.safety_tip
                });
            }
        }

        // No nearby disaster
        res.json({ 
            alert: false,
            location_distance_km: dist,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
Router.get("/getDisaster", async (req, res) => {
  return res.json("This is disaster");
});
module.exports = Router;
