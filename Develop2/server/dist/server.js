"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express = require('express');
const path = require('path');
const weatherRoutes_js_1 = __importDefault(require("./routes/api/weatherRoutes.js"));
const htmlRoutes_js_1 = __importDefault(require("./routes/htmlRoutes.js"));
dotenv_1.default.config();
const app = express();
const PORT = process.env.PORT || 3001;
// TODO: Serve static files of entire client dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));
// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes_js_1.default);
app.use("*", htmlRoutes_js_1.default);
// Start the server on the port
app.listen(PORT, () => console.log(`Server is runnning on htpp://localhost:${PORT}`));
