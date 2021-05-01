import {
	BOOKS_UPDATED,
	BOOK_ERROR,
	RECOMMENDATIONS_UPDATED,
	REMOVE_BOOK,
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
		case REMOVE_BOOK:
			return {
				...state,
				books: state.books.filter(
					(book) => book._id !== payload.bookId
				),
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
