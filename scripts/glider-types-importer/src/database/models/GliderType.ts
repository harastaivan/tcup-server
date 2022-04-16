import { Schema, model } from 'mongoose';
import { GliderTypeDocument } from './types';

export enum CompetitionClassType {
    CLUB = 'club',
    KOMBI = '18_meter'
}

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
    },
    competitionClassType: {
        type: String,
        required: true
    }
});

export const GliderTypeModel = model<GliderTypeDocument>('gliderType', GliderTypeSchema);
