"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Define route to serve index.html
router.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../../client/src/index.html'));
});
exports.default = router;
