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
dotenv_1.default.config();
(async () => {
    try {
        await (0, mongodb_1.default)();
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''],
            credentials: true,
        }));
        app.use(express_1.default.json());
        app.use('/auth', auth_route_1.default);
        app.use('/user', user_route_1.default);
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    catch (err) {
        console.log('Failed to start server:', err);
    }
})();
