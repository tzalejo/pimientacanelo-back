import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const verifyAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        verify(token, JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'No autorizado' });
    }
};
