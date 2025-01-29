"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Catch-all route to serve the front-end HTML file
router.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../client/dist/index.html'));
});
exports.default = router;
// update the import statement to use the new file path
