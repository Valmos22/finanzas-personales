import { Response } from 'express';

export const success = (res: Response, data: any, status = 200) =>
    res.status(status).json(data);

export const error = (res: Response, message: string, err: any, status = 500) =>
    res.status(status).json({ message, error: err });