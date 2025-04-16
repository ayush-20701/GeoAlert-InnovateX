const mongoose = require("mongoose");
const Disaster = mongoose.model(
  "Disaster",
  new mongoose.Schema({
    disaster_type: Number, //0 - Flood, 1 - cyclone, 2 - Earthquake, 3 - Landslide, 4 - Heatwave
    latitude: Number,
    longitude: Number,
    radius_km: Number,
    wind_speed: Number, //kmph
    flood_level: Number, //cm
    rainfall: Number, //cm
    temperature: Number, //celsius
    population_density: Number, //per sq km
    area_type: Number, //0 - urban, 1 - suburban, 2 - rural
    infrastructure_score: Number, //(0–10) of how resilient or prepared an area is to handle disasters.
    timestamp: Date,
  })
);
module.exports = Disaster;