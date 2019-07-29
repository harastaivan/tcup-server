import { GET_NEWS, NEWS_LOADING, ADD_NEWS, DELETE_NEWS } from '../actions/types';

const initialState = {
	news: [],
	loading: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_NEWS:
			return {
				...state,
				news: action.payload,
				loading: false
			};
		case NEWS_LOADING:
			return {
				...state,
				loading: true
			};
		case ADD_NEWS:
			return {
				...state,
				news: [ action.payload, ...state.news ]
			};
		case DELETE_NEWS:
			return {
				...state,
				news: state.news.filter((item) => item._id !== action.payload)
			};
		default:
			return state;
	}
};
