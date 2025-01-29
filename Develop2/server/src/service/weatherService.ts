import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temp: string;
  windSpeed: string;
  humidity: string;
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = WEATHER_API_KEY || '';

  // Fetch location data based on a query (e.g., city name)
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const response = await axios.get(`${this.baseURL}weather`, {
      params: {
        q: city,
        appid: this.apiKey,
      },
    });
    return this.destructureLocationData(response.data);
  }

  // Extract coordinates from location data
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  // Build a query URL for fetching forecast data based on coordinates
  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseURL}forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }

  // Fetch forecast data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  // Parse current weather information
  private parseCurrentWeather(data: any): Weather {
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
  private buildForecastArray(data: any[]): Weather[] {
    return data.slice(1, 6).map((forecast: any) => ({
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
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list);

    return { current: currentWeather, forecast };
  }
}

export default new WeatherService();
