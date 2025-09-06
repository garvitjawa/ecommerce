import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import connectDb from './config/mongodb';
(async (): Promise<void> => {
    try {
        await connectDb();
        const app = express();
        app.use(cors({
          origin: 'http://localhost:5173',
          credentials: true
        }));
        app.use(express.json());
        dotenv.config();
        app.use('/auth', authRoutes);
        app.use('/user', userRoutes);
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
    catch(err){
        console.log("Failed to start server:", err);
    }

})();