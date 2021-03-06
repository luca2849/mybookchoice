import {
	GET_USER,
	USER_ERROR,
	GET_USERS,
	FOLLOW_USER,
	UNFOLLOW_USER,
	CLEAR_USER,
	CLEAR_USERS,
	USER_UPDATED,
} from "../actions/types";

const initialState = {
	user: null,
	users: [],
	error: {},
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_USER:
			return {
				...state,
				user: payload,
				loading: false,
			};
		case USER_ERROR:
			return {
				...state,
				user: null,
				users: [],
			};
		case GET_USERS:
			return {
				...state,
				users: payload,
				loading: false,
			};
		case FOLLOW_USER:
		case UNFOLLOW_USER:
			return {
				...state,
				user: { ...state.user, followers: payload.followers },
				loading: false,
			};
		case USER_UPDATED:
			return {
				...state,
				user: payload,
				loading: false,
			};
		case CLEAR_USER:
		case CLEAR_USERS:
			return initialState;

		default:
			return state;
	}
}
