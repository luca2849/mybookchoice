import axios from "axios";
import { BOOKS_UPDATED, BOOK_ERROR, RECOMMENDATIONS_UPDATED } from "./types";
import { toast } from "react-toastify";

// Load User
export const getRecommendations = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/recommend?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: RECOMMENDATIONS_UPDATED, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: BOOK_ERROR });
	}
};
