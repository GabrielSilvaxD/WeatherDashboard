"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
class WeatherService {
    baseURL = 'https://api.openweathermap.org/data/2.5/';
    apiKey = WEATHER_API_KEY || '';
    // Fetch location data based on a query (e.g., city name)
    async fetchLocationData(city) {
        const response = await axios_1.default.get(`${this.baseURL}weather`, {
            params: {
                q: city,
                appid: this.apiKey,
            },
        });
        return this.destructureLocationData(response.data);
    }
    // Extract coordinates from location data
    destructureLocationData(locationData) {
        return {
            lat: locationData.coord.lat,
            lon: locationData.coord.lon,
        };
    }
    // Build a query URL for fetching forecast data based on coordinates
    buildWeatherQuery({ lat, lon }) {
        return `${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    }
    // Fetch forecast data using coordinates
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await axios_1.default.get(url);
        return response.data;
    }
    // Parse current weather information
    parseCurrentWeather(data) {
        const weatherData = data.list[0];
        return {
            city: data.city.name,
            date: new Date(weatherData.dt * 1000).toISOString().split('T')[0],
            icon: weatherData.weather[0].icon,
            iconDescription: weatherData.weather[0].description,
            temp: (weatherData.main.temp - 273.15).toFixed(2) + '°C', // Convert from Kelvin to Celsius
            windSpeed: weatherData.wind.speed + ' km/h',
            humidity: weatherData.main.humidity + '%',
        };
    }
    // Build a forecast array with simplified weather data
    buildForecastArray(data) {
        return data.slice(1, 6).map((forecast) => ({
            city: '',
            date: new Date(forecast.dt * 1000).toISOString().split('T')[0],
            icon: forecast.weather[0].icon,
            iconDescription: forecast.weather[0].description,
            temp: (forecast.main.temp - 273.15).toFixed(2) + '°C',
            windSpeed: forecast.wind.speed + ' km/h',
            humidity: forecast.main.humidity + '%',
        }));
    }
    // Public method to get weather for a city
    async getWeatherForCity(city) {
        const coordinates = await this.fetchLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecast = this.buildForecastArray(weatherData.list);
        return { current: currentWeather, forecast };
    }
}
exports.default = new WeatherService();
