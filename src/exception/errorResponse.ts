import { Request, Response, NextFunction } from 'express';

import { ServerError } from "./serverError.ts";

interface errorResponse {
    code: number,
    message: string
}

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServerError) {
        const errorResponse: errorResponse = {
            code: err.status,
            message: err.message,
        };  
        return res.status(err.status).json(errorResponse);
    } else {
        throw err
    }
}