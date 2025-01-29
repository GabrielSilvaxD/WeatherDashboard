"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
const weatherService_js_1 = __importDefault(require("../../service/weatherService.js"));
const historyService_js_1 = __importDefault(require("../../service/historyService.js"));
const router = (0, express_1.Router)();
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const city = req.body.city;
    if (!city) {
        return res.status(400).json({ message: 'City name is required' });
    }
    try {
        const weatherData = await weatherService_js_1.default.getWeatherForCity(city);
        return res.status(201).json(weatherData);
    }
    catch (error) {
        console.log('Error getting weather data:', error);
        return res.status(500).json({ message: 'Error getting weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_, res) => {
    try {
        const history = await historyService_js_1.default.getCities();
        res.json(history);
    }
    catch (error) {
        console.log('error retrieving seach history:', error);
        res.status(500).json({ message: 'Error retrieving search history' });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const success = await historyService_js_1.default.removeCity(id);
        if (!success) {
            return res.status(404).json({ message: 'City not found' });
        }
        return res.status(200).json({ message: 'City removed' });
    }
    catch (error) {
        console.log('Error deleting city:', error);
        return res.status(500).json({ message: 'Error deleting city' });
    }
});
exports.default = router;
