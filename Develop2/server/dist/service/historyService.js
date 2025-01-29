"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const HISTORY_FILE = path_1.default.join(__dirname, '../../../data/searchHistory.json');
// City class with `name` and `id` properties
class City {
    id;
    name;
    constructor(name) {
        this.id = (0, uuid_1.v4)();
        this.name = name;
    }
}
// HistoryService class for managing city search history
class HistoryService {
    // Read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await promises_1.default.readFile(HISTORY_FILE, 'utf8');
            return JSON.parse(data || '[]');
        }
        catch (error) {
            console.error('Error reading history file:', error);
            return [];
        }
    }
    // Write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await promises_1.default.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
        }
        catch (error) {
            console.error('Error writing to history file:', error);
        }
    }
    // GetCities method that returns an array of City objects
    async getCities() {
        return await this.read();
    }
    // AddCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.read();
        // Check if city is already in history
        if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
            return null;
        }
        const newCity = new City(cityName);
        cities.push(newCity);
        await this.write(cities);
        return newCity;
    }
    // RemoveCity method that removes a city by id
    async removeCity(id) {
        const cities = await this.read();
        const filteredCities = cities.filter((city) => city.id !== id);
        if (filteredCities.length === cities.length) {
            // No city was removed
            return false;
        }
        await this.write(filteredCities);
        return true;
    }
}
exports.default = new HistoryService();
