import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import User from './User.js';

const Schema = mongoose.Schema;

// Create Schema
const NewsSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	body: {
		type: String
	}
});

NewsSchema.plugin(timestamp);

const News = mongoose.model('news', NewsSchema);

export default News;
