"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const base_route_1 = __importDefault(require("./base.route"));
const user_model_1 = __importDefault(require("../model/user.model"));
class AuthRoutes extends base_route_1.default {
    constructor() {
        super();
        this.authRoutes();
    }
    authRoutes() {
        this.router.post('/login', async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).send('Username and password are required');
            }
            try {
                const user = await user_model_1.default.findOne({ name: username, password: password });
                if (!user) {
                    return res.status(401).send('Invalid credentials');
                }
                const secretKey = process.env.JWT_SECRET;
                if (!secretKey) {
                    throw new Error('JWT_SECRET not defined');
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, secretKey, {
                    expiresIn: '1h',
                });
                res.json({ token });
            }
            catch (err) {
                res.status(500).send('Error logging in: ' + err);
            }
        });
        this.router.post('/signup', async (req, res) => {
            const { username, password } = req.body;
            const newUser = new user_model_1.default({ name: username, password: password });
            if (!username || !password) {
                return res.status(400).send('Username and password are required');
            }
            newUser
                .save()
                .then(() => res.status(201).send('User created'))
                .catch((err) => res.status(500).send('Error creating user: ' + err.message));
        });
    }
}
exports.AuthRoutes = AuthRoutes;
exports.default = new AuthRoutes().router;
