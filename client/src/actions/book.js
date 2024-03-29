import axios from "axios";
import { BOOKS_UPDATED, BOOK_ERROR, RECOMMENDATIONS_UPDATED } from "./types";
import { toast } from "react-toastify";

import setAuthToken from "../utils/setAuthToken";

// Get general recommendations
export const getRecommendations = (limit, skip) => async (dispatch) => {
	try {
		setAuthToken(localStorage.getItem("token"));
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

// Get specific recommendations
export const getSpecificRecommendations = (
	genres,
	types,
	preferences,
	eras,
	limit
) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const body = JSON.stringify({ genres, types, preferences, eras });
		const res = await axios.post(
			`/api/recommend/specific?limit=${limit}`,
			body,
			config
		);
		dispatch({ type: BOOKS_UPDATED, payload: res.data });
	} catch (error) {
		dispatch({ type: BOOK_ERROR });
	}
};
