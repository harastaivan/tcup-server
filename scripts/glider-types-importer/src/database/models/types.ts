import { Document, HydratedDocument } from 'mongoose';
import { CompetitionClassType } from './GliderType';

export interface GliderType {
    name: string;
    index: number;
    handicap?: number;
    competitionClassType: CompetitionClassType;
}

export interface GliderTypeDocument extends GliderType, Document {}

export type HydratedGliderType = HydratedDocument<GliderTypeDocument>;
