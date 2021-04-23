import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { ADD_MESSAGE } from "../../actions/types";

const SocketNotifications = ({ user }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (user !== null) {
			const socket = io("/", { query: `user=${user.username}` });
			console.log(socket);
			socket.on("newMessage", (payload) => {
				console.log("New message");
				toast.info(`New message from ${payload.from}`, {
					autoClose: 2000,
				});
			});
			socket.on("message", (payload) => {
				console.log("message");
				if (payload.message) {
					dispatch({ type: ADD_MESSAGE, payload: payload.message });
				}
			});
		}
	}, []);
	return <></>;
};

export default SocketNotifications;
