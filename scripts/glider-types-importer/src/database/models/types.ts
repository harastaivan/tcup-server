import { Document, HydratedDocument } from 'mongoose';

export interface GliderType {
    name: string;
    index: number;
    handicap?: number;
}

export interface GliderTypeDocument extends GliderType, Document {}

export type HydratedGliderType = HydratedDocument<GliderTypeDocument>;
