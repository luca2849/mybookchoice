import axios from "axios";
import { RESULTS_UPDATED, CLEAR_RESULTS } from "./types";
import { toast } from "react-toastify";

export const searchUsers = (term) => async (dispatch) => {
	try {
		dispatch({ type: CLEAR_RESULTS });
		const res = await axios.get(`/api/data/user?search=${term}`);
		console.log(res.data);
		dispatch({ type: RESULTS_UPDATED, payload: res.data });
	} catch (error) {
		toast.error(error);
	}
};
