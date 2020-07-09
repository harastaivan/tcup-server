import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// Create Schema
const IgcFileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
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
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    downloaded: {
        type: Boolean,
        required: true,
        default: false
    },
    processed: {
        type: Boolean,
        required: true,
        default: false
    }
});

IgcFileSchema.plugin(timestamp);
IgcFileSchema.plugin(uniqueValidator);

const IgcFile = mongoose.model('igcFile', IgcFileSchema);

export default IgcFile;
