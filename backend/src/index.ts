import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import connectDb from './config/mongodb';

dotenv.config();

(async (): Promise<void> => {
  try {
    await connectDb();
    const app = express();
    app.use(
      cors({
        origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''],
        credentials: true,
      }),
    );
    app.use(express.json());
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log('Failed to start server:', err);
  }
})();
