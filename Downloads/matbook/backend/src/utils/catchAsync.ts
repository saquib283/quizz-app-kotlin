import type { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = (fn: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // If the promise rejects, catch it and pass it to the global error handler
        fn(req, res, next).catch(next);
    };
};