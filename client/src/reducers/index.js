import { combineReducers } from 'redux';
import errorReducer from './error';
import authReducer from './auth';

export default combineReducers({
	error: errorReducer,
	auth: authReducer
});
