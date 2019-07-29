import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const CompetitionClassSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	}
});

CompetitionClassSchema.plugin(timestamp);

const CompetitionClass = mongoose.model('competitionClass', CompetitionClassSchema);

export default CompetitionClass;
