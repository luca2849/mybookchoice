import {
	BOOKS_UPDATED,
	BOOK_ERROR,
	RECOMMENDATIONS_UPDATED,
} from "../actions/types";

const initialState = {
	loading: true,
	books: [],
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case RECOMMENDATIONS_UPDATED:
			return {
				...state,
				books: payload.books,
				loading: false,
			};
		case BOOKS_UPDATED:
			return {
				...state,
				books: payload,
				loading: false,
			};
		case BOOK_ERROR:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
}
