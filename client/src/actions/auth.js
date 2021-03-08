import axios from "axios";
import { USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL } from "./types";
import setAuthToken from "../utils/setAuthToken";
import { toast } from "react-toastify";

// Load User
export const loadUser = () => async (dispatch) => {
	console.log("fired");
	if (localStorage.token) {
		setAuthToken(localStorage.token);
		try {
			const res = await axios.get("/api/user");
			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (error) {
			console.log(error);
			dispatch({ type: AUTH_ERROR });
		}
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
		console.log(res.data);
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
