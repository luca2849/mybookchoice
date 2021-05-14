import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { ADD_MESSAGE, UPDATE_USER } from "../../actions/types";
import { loadUser } from "../../actions/auth";

const SocketNotifications = ({ user, loadUser }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (user !== null) {
			const socket = io("/", { query: `user=${user.username}` });
			socket.on("newMessage", (payload) => {
				toast.info(`New message from ${payload.from}`, {
					autoClose: 2000,
				});
			});
			socket.on("message", (payload) => {
				if (payload.message) {
					dispatch({ type: ADD_MESSAGE, payload: payload.message });
				}
			});
			socket.on("friendRequest", (payload) => {
				toast.info(
					`You have a new friend request from ${payload.username}`
				);
			});
			socket.on("reqAccepted", (payload) => {
				if (payload.user) {
					toast.success(
						`${payload.user.username} has accepted your request.`
					);
				}

				dispatch({ type: UPDATE_USER, payload: payload.user });
			});
			socket.on("res", (payload) => {
				loadUser();
			});
		}
	}, [dispatch, user, loadUser]);
	return <></>;
};

export default connect(null, { loadUser })(SocketNotifications);
