"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function connectDb() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined');
    }
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
