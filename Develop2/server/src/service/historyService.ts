import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const HISTORY_FILE = path.join(__dirname, '../../../data/searchHistory.json');

// City class with `name` and `id` properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}

// HistoryService class for managing city search history
class HistoryService {
  // Read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('Error reading history file:', error);
      return [];
    }
  }

  // Write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to history file:', error);
    }
  }

  // GetCities method that returns an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // AddCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City | null> {
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
  async removeCity(id: string): Promise<boolean> {
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

export default new HistoryService();
