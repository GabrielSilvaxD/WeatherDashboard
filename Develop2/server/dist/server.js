"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const weatherRoutes_1 = __importDefault(require("./routes/api/weatherRoutes"));
const htmlRoutes_1 = __importDefault(require("./routes/htmlRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)(); // Move the declaration of 'app' before 'app.use(cors())'
app.use((0, cors_1.default)());
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Middleware for parsing JSON and serving static files
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/dist')));
// Use the weather API router for API requests
app.use('/api/weather', weatherRoutes_1.default);
// Use the HTML router for front-end routes
app.use('*', htmlRoutes_1.default);
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
