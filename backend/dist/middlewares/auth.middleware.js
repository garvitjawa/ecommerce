"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user.model"));
class AuthMiddleware {
    static async authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).send('Authorization header missing');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Token missing');
        }
        try {
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
                throw new Error('JWT_SECRET not defined');
            }
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            const user = await user_model_1.default.findById(decoded.id);
            if (!user) {
                return res.status(401).send('User not found');
            }
            req.user = user;
            next();
        }
        catch (err) {
            return res.status(403).send('Invalid token');
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.default = AuthMiddleware;
