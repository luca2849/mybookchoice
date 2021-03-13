import { BOOKS_UPDATED, BOOK_ERROR } from "../actions/types";

const initialState = {
	loading: true,
	books: [],
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case BOOK_ERROR:
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null,
			};
		case BOOKS_UPDATED:
			return {
				...state,
				books: payload,
			};
		default:
			return state;
	}
}
