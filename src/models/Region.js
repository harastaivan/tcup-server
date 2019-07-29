import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const RegionSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	}
});

RegionSchema.plugin(timestamp);

const Region = mongoose.model('region', RegionSchema);

export default Region;
