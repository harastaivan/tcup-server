import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const ContestSchema = new Schema({
    soaringSpotId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    }
});

ContestSchema.plugin(timestamp);

const Contest = mongoose.model('contest', ContestSchema);

export default Contest;
