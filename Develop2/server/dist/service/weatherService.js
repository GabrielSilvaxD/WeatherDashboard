"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
console.log(WEATHER_API_KEY);
class WeatherService {
    baseURL = 'https://api.openweathermap.org/data/2.5/';
    apiKey = `&appid=${WEATHER_API_KEY}`;
    async fetchLocationData(query) {
        const response = await axios_1.default.get(`${this.baseURL}weather`, {
            params: {
                q: query,
                appid: this.apiKey,
            }
        });
        return this.destructureLocationData(response.data);
    }
    destructureLocationData(locationdata) {
        return {
            lat: locationdata.coord.lat,
            lon: locationdata.coord.lon,
        };
    }
    buildWeatherQuery({ lat, lon }) {
        return `${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    }
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const response = await axios_1.default.get(url);
        return response.data;
    }
    parseCurrentWeather(response) {
        const weatherdata = response.current;
        return {
            city: response.timezone,
            country: '',
            date: new Date(weatherdata.dt * 1000).toLocaleDateString(),
            description: weatherdata.weather[0].description,
            main: weatherdata.weather[0].main,
            temp: weatherdata.temp + '°C',
            feels_like: weatherdata.feels_like,
            temp_min: weatherdata.temp_min,
            temp_max: weatherdata.temp_max,
            humidity: weatherdata.humidity + '%',
            wind_speed: weatherdata.wind_speed + 'km/h',
        };
    }
    buildForecastArray(data) {
        return data.slice(1, 6).map((forecast) => ({
            city: '',
            country: '',
            description: '',
            main: '',
            feels_like: 0,
            temp_min: 0,
            temp_max: 0,
            wind_speed: '',
            date: new Date(forecast.dt * 1000).toLocaleDateString(),
            icon: forecast.weather[0].icon,
            iconDescription: forecast.weather[0].description,
            temp: (forecast.main.temp - 273.15).toFixed(2) + '°C',
            windSpeed: forecast.wind.speed + 'km/h',
            humidity: forecast.main.humidity + '%',
        }));
    }
    async getWeatherForCity(city) {
        const coordinates = await this.fetchLocationData(city);
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecast = this.buildForecastArray(weatherData.list);
        return { current: currentWeather, forecast };
    }
}
exports.default = new WeatherService();
