import axios from "axios";
import {
	USER_ERROR,
	USER_UPDATED,
	BOOKS_UPDATED,
	PASSWORD_RESET,
	REMOVE_BOOK,
	CLEAR_USER,
	RATINGS_UPDATED,
	RATING_UPDATED,
	RATINGS_ADDED,
	GET_USER,
	GET_NOTIFICATIONS,
	FRIEND_REMOVED,
	GET_FRIENDS,
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
		dispatch({ type: CLEAR_USER });
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

export const getNotifications = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/user/notifications?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: GET_NOTIFICATIONS, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const sendFriendRequest = (remoteUser) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const body = JSON.stringify({ remoteUser });
		await axios.put(`/api/user/friends/request`, body, config);
		toast.success(`Friend request sent to ${remoteUser}.`, {
			autoClose: 2000,
		});
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const removeFriend = (remoteUser) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/user/friends`, {
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				remoteUser: remoteUser,
			},
		});
		toast.success(`Removed ${remoteUser} as a friend.`, {
			autoClose: 2000,
		});
		dispatch({ type: FRIEND_REMOVED, payload: res.data });
	} catch (error) {
		console.error(error);
		// const errors = error.response.data.errors;
		// if (errors) {
		// 	errors.forEach((error) => toast.error(error.msg, "danger"));
		// }
		// dispatch({ type: USER_ERROR });
	}
};

export const respondToRequest = (
	notificationId,
	remoteUser,
	accepted,
	limit,
	skip
) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const body = JSON.stringify({ notificationId, remoteUser, accepted });
		const res = await axios.put(
			`/api/user/friends/respond?limit=${limit}&skip=${skip}`,
			body,
			config
		);
		toast.success("Response Sent", { autoClose: 2000 });
		if (accepted) {
			dispatch({ type: USER_UPDATED, payload: res.data });
		}
		dispatch({ type: GET_NOTIFICATIONS, payload: res.data.notifications });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const getFriends = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/user/friends?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: GET_FRIENDS, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const addBookToReadingList = (bookId, rating) => async (dispatch) => {
	try {
		if (rating !== 0) {
			dispatch({ type: REMOVE_BOOK, payload: { bookId } });
		}
		if (rating === 1) {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const body = JSON.stringify({ bookId });
			const res = await axios.post(`/api/user/list`, body, config);
			toast.success("Added to reading list");
			dispatch({ type: USER_UPDATED, payload: res.data.user });
		}
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
	}
};

export const deleteBookFromList = (bookId) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/user/list`, {
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				bookId: bookId,
			},
		});
		toast.success("Deleted from reading list");
		dispatch({ type: USER_UPDATED, payload: res.data.user });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
	}
};
