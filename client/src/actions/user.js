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

export const editProfile = (formData) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ formData });
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
		console.log(picture);
		console.log(fd);
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
