import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// Create Schema
const DocumentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    }
});

DocumentSchema.plugin(timestamp);
DocumentSchema.plugin(uniqueValidator);

const Document = mongoose.model('document', DocumentSchema);

export default Document;
