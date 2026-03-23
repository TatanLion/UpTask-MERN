import { Document, Schema, Types } from "mongoose";
import mongoose from 'mongoose';

export interface IToken extends Document {
    token: string;
    userId: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 10 // 10 minutes
    }
});

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;