import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const AccomodationTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	}
});

AccomodationTypeSchema.plugin(timestamp);

const AccomodationType = mongoose.model('accomodationType', AccomodationTypeSchema);

export default AccomodationType;
