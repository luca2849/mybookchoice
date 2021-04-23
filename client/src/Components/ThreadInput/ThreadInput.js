import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

import styles from "./ThreadInput.module.css";

import { FiSend } from "react-icons/fi";
import { sendMessage } from "../../actions/messaging";
import { toast } from "react-toastify";

let socket;

const ThreadInput = ({ selectedThread, me, sendMessage }) => {
	const [message, setMessage] = useState("");
	useEffect(() => {
		socket = io("/", { query: `user=${me.username}` });
		socket.emit("joinRoom", {
			threadId: selectedThread,
			currentUser: me._id,
		});
	}, []);
	const handleSend = () => {
		if (message === "") {
			toast.error("Message must not be empty.");
			return;
		}
		// sendMessage(selectedThread, message);
		// Clear input
		socket.emit("message", {
			message: message,
			threadId: selectedThread,
			username: me.username,
		});
		setMessage("");
		toast.success("Message Sent");
	};
	return (
		<div className={styles.container}>
			<div className={styles.inputContainer}>
				<input
					type="text"
					placeholder="Message..."
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSend();
						}
					}}
				/>
			</div>
			<div className={styles.sendButtonContainer}>
				<button onClick={() => handleSend()}>
					<FiSend />
				</button>
			</div>
		</div>
	);
};

export default connect(null, { sendMessage })(ThreadInput);
