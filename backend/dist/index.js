"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
(async () => {
    try {
        await (0, mongodb_1.default)();
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            credentials: true
        }));
        app.use(express_1.default.json());
        dotenv_1.default.config();
        app.use('/auth', auth_route_1.default);
        app.use('/user', user_route_1.default);
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
    catch (err) {
        console.log("Failed to start server:", err);
    }
})();
