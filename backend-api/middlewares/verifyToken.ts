import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../database/configJwt';

const SECRET_KEY = process.env.JWT_SECRET || JWT_SECRET;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'No token, Authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { id: number; email: string; };
        req.user = {
            id: decoded.id,
            email: decoded.email,
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
}