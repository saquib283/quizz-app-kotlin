import express from 'express';
import cors from 'cors';
import formRoutes from './routes/formRoutes.js';
import { globalErrorHandler } from './middleware/errorHandler.js'; // Import handler
import { AppError } from './utils/ApiError.js';

process.on('uncaughtException', (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', formRoutes);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});