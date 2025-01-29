import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

const router = Router();

// POST /api/weather - Fetch weather for a city and save it to search history
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' }); // Add return
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.status(201).json(weatherData); // Add return
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' }); // Add return
  }
});

// GET /api/weather/history - Retrieve search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE /api/weather/history/:id - Remove a city from search history by ID
router.delete('/history/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const result = await HistoryService.removeCity(id);
    if (!result) {
      return res.status(404).json({ error: 'City not found in history' });
    }
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;

