import React from "react";
import styles from "./MessageThread.module.css";
const MessageThread = ({ messages, me }) => {
	return (
		<div>
			{messages.map((message) => (
				<div className={styles.messageContainer}>
					<div
						className={`${styles.message} ${
							message.user._id === me
								? styles.myMessage
								: styles.otherMessage
						}`}
					>
						<p>{message.text}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default MessageThread;
