"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historyService_1 = __importDefault(require("../../service/historyService"));
const weatherService_1 = __importDefault(require("../../service/weatherService"));
const router = (0, express_1.Router)();
// POST /api/weather - Fetch weather for a city and save it to search history
router.post('/', async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' }); // Add return
    }
    try {
        const weatherData = await weatherService_1.default.getWeatherForCity(city);
        return res.status(201).json(weatherData); // Add return
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ error: 'Failed to retrieve weather data' }); // Add return
    }
});
// GET /api/weather/history - Retrieve search history
router.get('/history', async (_req, res) => {
    try {
        const history = await historyService_1.default.getCities();
        res.json(history);
    }
    catch (error) {
        console.error('Error retrieving search history:', error);
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// DELETE /api/weather/history/:id - Remove a city from search history by ID
router.delete('/history/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await historyService_1.default.removeCity(id);
        if (!result) {
            return res.status(404).json({ error: 'City not found in history' });
        }
        return res.status(200).json({ message: 'City removed from history' });
    }
    catch (error) {
        console.error('Error deleting city from history:', error);
        return res.status(500).json({ error: 'Failed to delete city from history' });
    }
});
exports.default = router;
