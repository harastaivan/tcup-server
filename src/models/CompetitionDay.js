import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const CompetitionDaySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    task: {
        type: String,
        required: true,
        enum: ['NO_TASK', 'TASK_CANCELLED', 'TASK'],
        default: 'NO_TASK'
    }
});

CompetitionDaySchema.plugin(timestamp);

const CompetitionDay = mongoose.model('competitionDay', CompetitionDaySchema);

export default CompetitionDay;
