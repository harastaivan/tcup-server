import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const DailyResultSchema = new Schema({
    points: {
        type: Number,
        required: true
    },
    points_total: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    position_total: {
        type: Number,
        required: true
    },
    flightId: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    aeroclub: {
        type: String,
        required: false,
        default: ''
    },
    glider: {
        type: String,
        required: true
    },
    handicap: {
        type: Number,
        required: true
    },
    day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'competitionDay',
        required: true
    },
    competitionClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'competitionClass',
        required: true
    }
});

DailyResultSchema.plugin(timestamp);

const DailyResult = mongoose.model('dailyResult', DailyResultSchema);

export default DailyResult;
