import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create Schema
const GliderTypeSchema = new Schema({
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

const GliderType = mongoose.model('gliderType', GliderTypeSchema);

export default GliderType;
