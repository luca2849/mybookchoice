import {
	GET_THREADS,
	GET_MESSAGES,
	CLEAR_THREADS,
	CLEAR_MESSAGES,
	CLEAR_MESSAGING,
	CLEAR_THREAD,
	GET_THREAD,
	ADD_MESSAGES,
	ADD_MESSAGE,
	MESSAGE_RECEIVED,
	NEW_THREAD,
} from "../actions/types";

const initialState = {
	messages: {
		messages: [],
		totalMessages: null,
	},
	threads: [],
	thread: null,
	loading: true,
};

export default function messaging(state = initialState, action) {
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
				messages: {
					messages: payload.messages,
					totalMessages: payload.totalMessages,
				},
				loading: false,
			};
		}
		case ADD_MESSAGES: {
			return {
				...state,
				messages: {
					...state.messages,
					messages: state.messages.messages.concat(payload.messages),
				},
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
				messages: {
					messages: [],
					totalMessages: null,
				},
			};
		case ADD_MESSAGE:
		case MESSAGE_RECEIVED:
			return {
				...state,
				messages: {
					...state.messages,
					messages: [payload, ...state.messages.messages],
				},
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
