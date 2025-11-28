import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/ApiError.js';
const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleSQLiteError = (err: any) => {
    if (err.code === 'SQLITE_CONSTRAINT') {
        return new AppError('Duplicate field value entered.', 400);
    }
    return new AppError('Database operation failed', 500);
};

const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        errors: err.errors, 
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors && { errors: err.errors }),
        });
    }
    console.error('ERROR 💥', err);

    return res.status(500).json({
        success: false,
        message: 'Something went wrong on the server'
    });
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, message: err.message, name: err.name };
        if (error.code === 'SQLITE_CONSTRAINT') error = handleSQLiteError(error);
        if (!error.isOperational) {
            error = new AppError(err.message || 'Internal Server Error', err.statusCode || 500);
        }

        sendErrorProd(error, res);
    }
};