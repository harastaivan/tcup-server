import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const CompetitorStatusSchema = new Schema({
    day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'competitionDay',
        required: true
    },
    pilot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registration',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['DNF', 'FLYING', 'OUTLANDING', 'HOME'],
        default: 'DNF'
    }
});

CompetitorStatusSchema.plugin(timestamp);

const CompetitorStatus = mongoose.model('competitorStatus', CompetitorStatusSchema);

export default CompetitorStatus;
