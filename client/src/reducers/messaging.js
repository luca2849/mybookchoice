import {
	GET_THREADS,
	GET_MESSAGES,
	SEND_MESSAGE,
	CLEAR_THREADS,
	CLEAR_MESSAGES,
	CLEAR_MESSAGING,
	CLEAR_THREAD,
	GET_THREAD,
	ADD_MESSAGE,
	MESSAGE_RECEIVED,
	NEW_THREAD,
} from "../actions/types";

const initialState = {
	messages: [],
	threads: [],
	thread: null,
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_THREADS: {
			return {
				...state,
				threads: payload,
				loading: false,
			};
		}
		case NEW_THREAD: {
			return {
				...state,
				threads: [payload, ...state.threads],
			};
		}
		case GET_MESSAGES: {
			return {
				...state,
				messages: payload,
				loading: false,
			};
		}
		case GET_THREAD: {
			return {
				...state,
				thread: payload.thread,
				loading: false,
			};
		}
		case CLEAR_THREADS:
			return {
				...state,
				threads: [],
			};
		case CLEAR_MESSAGES:
			return {
				...state,
				messages: [],
			};
		case ADD_MESSAGE:
		case MESSAGE_RECEIVED:
			return {
				...state,
				messages: [payload, ...state.messages],
			};
		case CLEAR_THREADS:
			return {
				...state,
				messages: [],
			};
		case CLEAR_THREAD:
			return {
				...state,
				thread: null,
				loading: true,
			};
		case CLEAR_MESSAGING: {
			return initialState;
		}
		default:
			return state;
	}
}
