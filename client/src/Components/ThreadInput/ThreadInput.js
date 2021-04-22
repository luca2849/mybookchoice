import React, { useState, useRef } from "react";
import { connect } from "react-redux";

import styles from "./ThreadInput.module.css";

import { FiSend } from "react-icons/fi";
import { sendMessage } from "../../actions/messaging";
import { toast } from "react-toastify";

const ThreadInput = ({ selectedThread, sendMessage }) => {
	const [message, setMessage] = useState("");
	const inputRef = useRef(null);
	const handleSend = () => {
		if (message === "") {
			toast.error("Message must not be empty.");
			return;
		}
		sendMessage(selectedThread, message);
		// Clear input
		setMessage("");
		toast.success("Message Sent");
	};
	return (
		<div className={styles.container}>
			<div className={styles.inputContainer}>
				<input
					ref={inputRef}
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
