import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface JWTData {
    id: Types.ObjectId;
}

export const generateJWT = (payload: JWTData) => {
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1h' }
    );
    return token;
}