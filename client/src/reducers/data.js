import { RESULTS_UPDATED, CLEAR_RESULTS } from "../actions/types";

const initialState = {
	loading: true,
	searchResults: [],
};

export default function data(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case RESULTS_UPDATED:
			return {
				...state,
				loading: false,
				searchResults: payload,
			};
		case CLEAR_RESULTS:
			return {
				...state,
			};
		default:
			return state;
	}
}
