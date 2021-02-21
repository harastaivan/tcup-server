import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const ResetPasswordSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
});

ResetPasswordSchema.plugin(timestamp);

const ResetPassword = mongoose.model('resetPassword', ResetPasswordSchema);

export default ResetPassword;
