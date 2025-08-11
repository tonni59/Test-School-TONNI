import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = verifyAccessToken(token) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}