"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new pg_1.Client({
    host: process.env.HOST,
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    database: process.env.DATABASE,
    user: "postgresss",
    password: process.env.PASSWORD,
});
exports.client = client;
client.connect((err) => {
    const customError = new Error("DB connection failed");
    if (err) {
        customError.message = err.message;
        throw customError;
    }
    else
        console.log("DB connected");
});
