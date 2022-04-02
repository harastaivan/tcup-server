import { Schema, model } from 'mongoose';
import { GliderTypeDocument } from './types';

const GliderTypeSchema = new Schema<GliderTypeDocument>({
    name: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    handicap: {
        type: Number
    }
});

export const GliderTypeModel = model<GliderTypeDocument>('gliderType', GliderTypeSchema);
