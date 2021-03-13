import axios from "axios";
import { USER_ERROR, USER_UPDATED, BOOKS_UPDATED } from "./types";
import { toast } from "react-toastify";

// Login User
export const addPreferences = (formData) => async (dispatch) => {
	const { genres, types, authors } = formData;
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ genres, types, authors });
	try {
		const res = await axios.post("/api/user/preferences", body, config);
		toast.info("Preferences Saved");
		dispatch({ type: USER_UPDATED, payload: res.data });
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const addRating = (bookData, rating) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ bookData, rating });
	try {
		const res = await axios.post("/api/user/rating", body, config);
		toast.success("Rating Added", { autoClose: 2000 });
		dispatch({ type: USER_UPDATED, payload: res.data });
		dispatch({ type: BOOKS_UPDATED, payload: res.data });
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};
