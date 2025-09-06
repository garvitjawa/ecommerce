import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import BaseRoute from './base.route';
import User from '../model/user.model';
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
    this.authRoutes();
  }
  private authRoutes(): void {
    this.router.post('/login', async (req: Request, res: Response) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      }
      try {
        const user = await User.findOne({ name: username, password: password });
        if (!user) {
          return res.status(401).send('Invalid credentials');
        }
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
          throw new Error('JWT_SECRET not defined');
        }
        const token = jwt.sign({ id: user._id }, secretKey, {
          expiresIn: '1h',
        });
        res.json({ token });
      } catch (err) {
        res.status(500).send('Error logging in: ' + err);
      }
    });

    this.router.post('/signup', async (req: Request, res: Response) => {
      const { username, password } = req.body;
      const newUser = new User({ name: username, password: password });
      if (!username || !password) {
        return res.status(400).send('Username and password are required');
      }
      newUser
        .save()
        .then(() => res.status(201).send('User created'))
        .catch((err) =>
          res.status(500).send('Error creating user: ' + err.message),
        );
    });
  }
}

export default new AuthRoutes().router;
