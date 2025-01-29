"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Define a City class with name and id properties
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const HISTORY_FILE = path_1.default.join(__dirname, '../searchHistory.json');
class City {
    id;
    name;
    constructor(name) {
        this.id = (0, uuid_1.v4)();
        this.name = name;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    async read() {
        try {
            const data = await promises_1.default.readFile('searchHistory.json', 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading this file:', error);
            return [];
        }
    }
    async write(cities) {
        try {
            await promises_1.default.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
        }
        catch (error) {
            console.error('Error writing to this file:', error);
        }
    }
    async getCities() {
        return await this.read();
    }
    async addCity(cityName) {
        const cities = await this.read();
        if (cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
            return null;
        }
        const newCity = new City(cityName);
        cities.push(newCity);
        await this.write(cities);
        return newCity;
    }
    async removeCity(id) {
        const cities = await this.read();
        const filteredCities = cities.filter((city) => city.id !== id);
        if (filteredCities.length === cities.length) {
            return false;
        }
        await this.write(filteredCities);
        return true;
    }
}
exports.default = new HistoryService();
