import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

// Create Schema
const RegistrationSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	isOnStartingList: {
		type: Boolean,
		required: true,
		default: false
	},
	birthDate: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: true
	},
	aeroclub: {
		type: String,
		required: true
	},
	region: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'region',
		required: true
	},
	glider: {
		gliderType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'gliderType',
			required: true
		},
		registrationNumber: {
			type: String,
			required: true
		},
		startNumber: {
			type: String,
			required: true
		}
	},
	competitionClass: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'competitionClass',
		required: true
	},
	logger: {
		type: String,
		required: true
	},
	accomodation: {
		accomodationType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'accomodationType',
			required: true
		},
		quantity: {
			type: Number,
			required: false,
			default: 0
		}
	},
	meals: {
		type: Number,
		required: false,
		default: 0
	},
	note: {
		type: String,
		required: false
	}
});

RegistrationSchema.plugin(timestamp);

const Registration = mongoose.model('registration', RegistrationSchema);

export default Registration;
