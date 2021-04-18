import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const CompetitionClassSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: ''
    },
    soaringSpotId: {
        type: Number,
        required: true,
        default: 0
    }
});

CompetitionClassSchema.plugin(timestamp);

const CompetitionClass = mongoose.model('competitionClass', CompetitionClassSchema);

export default CompetitionClass;
