import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const TrackingSchema = new Schema({
    day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'competitionDay',
        required: true
    },
    competitionClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'competitionClass',
        required: true
    },
    taskUrl: {
        type: String,
        required: true
    }
});

TrackingSchema.plugin(timestamp);

const Tracking = mongoose.model('tracking', TrackingSchema);

export default Tracking;
