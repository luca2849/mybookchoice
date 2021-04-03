import axios from "axios";
import {
	USER_ERROR,
	USER_UPDATED,
	BOOKS_UPDATED,
	PASSWORD_RESET,
	LOGOUT,
	RATINGS_UPDATED,
	RATING_UPDATED,
	RATINGS_ADDED,
	GET_USER,
} from "./types";
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

export const editProfile = (formData) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify(formData);
	try {
		const res = await axios.put("/api/user", body, config);
		toast.success("Updates Saved", { autoClose: 2000 });
		dispatch({ type: USER_UPDATED, payload: res.data });
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const changeProfilePicture = (picture) => async (dispatch) => {
	try {
		let fd = new FormData();
		fd.append("profileImage", picture[0], picture[0].name);
		const res = await axios.post("/api/user/avatar", fd);
		dispatch({ type: USER_UPDATED, payload: res.data });
		toast.success("Profile image updated", { autoClose: 2000 });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const requestPasswordReset = (formData) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify(formData);
	try {
		const res = await axios.post("/api/user/password", body, config);
		toast.success("E-Mail Sent");
		dispatch({ type: PASSWORD_RESET, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const changePassword = (formData, token) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	formData["token"] = token;
	const body = JSON.stringify(formData);
	try {
		await axios.post("/api/user/password/reset", body, config);
		toast.success("Password Reset");
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const getUser = (username) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/user/${username}`);
		dispatch({ type: GET_USER, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const getRatings = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/user/ratings?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: RATINGS_UPDATED, payload: res.data.ratings });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const addToRatings = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/user/ratings?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: RATINGS_ADDED, payload: res.data.ratings });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const updateRating = (ratingId, newRating) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const body = JSON.stringify({ ratingId, newRating });
		const res = await axios.put(`/api/user/ratings`, body, config);
		toast.success("Rating Updated", { autoClose: 2000 });
		dispatch({ type: RATING_UPDATED, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};
