const express = require("express");
const Disaster = require("../models/disaster");
const Router = express.Router();

//ADD DISASTER
Router.post('/addDisaster', async(req, res) => {
    const { disaster_type,
            latitude,
            longitude,
            radius_km,
            wind_speed, 
            flood_level, 
            rainfall, 
            temperature, 
            population_density, 
            area_type, 
            infrastructure_score, } = req.body;
    try {
        const newDisaster = new Disaster({
            disaster_type, //0 - Flood, 1 - cyclone, 2 - Earthquake, 3 - Landslide, 4 - Heatwave
            latitude,
            longitude,
            radius_km,
            wind_speed, //kmph
            flood_level, //cm
            rainfall, //cm
            temperature, //celsius
            population_density, //per sq km
            area_type, //0 - urban, 1 - suburban, 2 - rural
            infrastructure_score, //(0–10) of how resilient or prepared an area is to handle disasters.
            timestamp: new Date()
        });
    
        await newDisaster.save();
        res.status(201).json({ message: 'Disaster added successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding disaster' });
      }
})

//GET ALL DISASTERS
Router.get('/getDisasters', async (req, res) => {
    const disasters = await Disaster.find({});
    res.json(disasters);
});

//DELETE
Router.delete('/deleteDisaster/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDisaster = await Disaster.findByIdAndDelete(id);

        if (!deletedDisaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }

        res.status(200).json({ message: 'Disaster deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting disaster' });
    }
});
module.exports = Router