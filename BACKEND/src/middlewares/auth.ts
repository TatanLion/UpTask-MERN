import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/User.model";

import dotenv from 'dotenv';
dotenv.config();


declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        return res.status(401).json({ message: 'Authorization header required' });
    }

    const token = bearerToken.split(' ')[1];
    // const [_, token] = bearerToken.split(' ');

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            // We only want to retrieve the user's ID, email, and name
            const user = await User.findById(decoded.id).select('_id email name');
            if (user) {
                req.user = user;
                next();
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}