import axios from "axios";
import { USER_LOADED, AUTH_ERROR } from "./types";
import setAuthToken from "../utils/setAuthToken";
// import { toast } from "react-toastify";

// Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
		try {
			const res = await axios.get("/api/auth");
			dispatch({ type: USER_LOADED, payload: res.data.user });
		} catch (error) {
			dispatch({ type: AUTH_ERROR });
		}
	}
};
