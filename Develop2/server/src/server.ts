import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import weatherRouter from './routes/api/weatherRoutes';
import htmlRouter from './routes/htmlRoutes';
import cors from 'cors';

const app = express(); // Move the declaration of 'app' before 'app.use(cors())'

app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

// Use the weather API router for API requests
app.use('/api/weather', weatherRouter);

// Use the HTML router for front-end routes
app.use('*', htmlRouter);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));