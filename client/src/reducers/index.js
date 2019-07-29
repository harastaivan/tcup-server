import { combineReducers } from 'redux';
import errorReducer from './error';
import authReducer from './auth';
import newsReducer from './news';

export default combineReducers({
	error: errorReducer,
	auth: authReducer,
	news: newsReducer
});
