import axios from "axios";
import {
	GET_THREADS,
	GET_MESSAGES,
	GET_THREAD,
	SEND_MESSAGE,
	CLEAR_THREADS,
	CLEAR_MESSAGES,
	CLEAR_MESSAGING,
	CLEAR_THREAD,
	ADD_MESSAGE,
	NEW_THREAD,
	MESSAGE_ERROR,
} from "./types";
import { toast } from "react-toastify";

export const getThreads = (limit, skip) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/messaging/threads?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: GET_THREADS, payload: res.data });
	} catch (error) {
		toast.error(error);
		dispatch({ type: MESSAGE_ERROR });
	}
};

export const getMessages = (threadId, limit, skip) => async (dispatch) => {
	dispatch({ type: CLEAR_MESSAGES });
	try {
		const res = await axios.get(
			`/api/messaging/${threadId}?limit=${limit}&skip=${skip}`
		);
		dispatch({ type: GET_MESSAGES, payload: res.data });
	} catch (error) {
		toast.error(error);
		dispatch({ type: MESSAGE_ERROR });
	}
};

export const getThread = (threadId) => async (dispatch) => {
	dispatch({ type: CLEAR_THREAD });
	try {
		const res = await axios.get(`/api/messaging/thread/${threadId}`);
		dispatch({ type: GET_THREAD, payload: res.data });
	} catch (error) {
		toast.error(error);
		dispatch({ type: MESSAGE_ERROR });
	}
};

export const sendMessage = (threadId, text) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const res = await axios.post(
			`/api/messaging/message${threadId}`,
			{ text },
			config
		);
		dispatch({ type: ADD_MESSAGE, payload: res.data });
	} catch (error) {
		toast.error(error);
		dispatch({ type: MESSAGE_ERROR });
	}
};

export const createThread = (username) => async (dispatch) => {
	try {
		const res = await axios.post(`/api/messaging/${username}`);
		dispatch({ type: NEW_THREAD, payload: res.data.newThread });
	} catch (error) {
		toast.error(error);
		dispatch({ type: MESSAGE_ERROR });
	}
};
