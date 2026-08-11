import mongoose, { Schema, Document } from 'mongoose';

interface IGame extends Document {
    title: string;
    description: string;
    developerName: string;
    webGameUrl?: string;
    apkFileName?: string;
    createdAt: Date;
}

const GameSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    developerName: { type: String, required: true },
    webGameUrl: { type: String },
    apkFileName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGame>('Game', GameSchema);