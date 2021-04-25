import axios from "axios";
import {
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGOUT,
	USER_ERROR,
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { toast } from "react-toastify";

// Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
		try {
			const res = await axios.get("/api/user");
			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (error) {
			//dispatch({ type: AUTH_ERROR });
		}
	} else {
		dispatch({ type: AUTH_ERROR });
	}
};

// Login User
export const login = (formData) => async (dispatch) => {
	const { email, password } = formData;
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ email, password });
	try {
		const res = await axios.post("/api/auth/login/email", body, config);
		toast.info("Login Successful");
		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: LOGIN_FAIL });
	}
};

// Register user
export const register = (formData) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify(formData);
	try {
		const res = await axios.post("/api/auth/register/email", body, config);
		toast.info("Registration Successful");
		dispatch({ type: REGISTER_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: REGISTER_FAIL });
	}
};

export const authenticateWithGoogle = (response) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const result = response?.profileObj;
		const token = response?.tokenId;
		const accessToken = response?.tokenObj?.access_token;
		const body = JSON.stringify({
			result,
			token,
			accessToken,
		});
		const res = await axios.post("/api/auth/google", body, config);
		toast.success("Google sign in successful", { autoClose: 3000 });
		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: REGISTER_FAIL });
	}
};

export const authenticateWithFacebook = (accessToken, id) => async (
	dispatch
) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const body = JSON.stringify({
			accessToken,
			id,
		});
		const res = await axios.post("/api/auth/facebook", body, config);
		toast.success("Facebook sign in successful", { autoClose: 3000 });
		dispatch({ type: LOGIN_SUCCESS, payload: res.data });
		dispatch(loadUser());
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: REGISTER_FAIL });
	}
};

export const deleteUser = () => async (dispatch) => {
	try {
		setAuthToken(localStorage.getItem("token"));
		const res = await axios.delete("/api/user");
		toast.success("Account Deleted");
		dispatch({ type: LOGOUT, payload: res.data });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};

export const logout = () => async (dispatch) => {
	try {
		toast.info("Successfully logged out", { autoClose: 2000 });
		dispatch({ type: LOGOUT });
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => toast.error(error.msg, "danger"));
		}
		dispatch({ type: USER_ERROR });
	}
};
