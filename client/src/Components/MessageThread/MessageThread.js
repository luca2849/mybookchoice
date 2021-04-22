import React, { useState } from "react";
import styles from "./MessageThread.module.css";

const MessageThread = ({
	messages,
	totalMessages,
	me,
	getMessages,
	selectedThread,
}) => {
	const [page, setPage] = useState(1);
	const loadMore = () => {
		if (messages.length !== totalMessages) {
			getMessages(selectedThread, 10, page * 10);
			setPage(page + 1);
		}
	};
	if (messages.length < 1) return <p>Loading...</p>;
	return (
		<div className={styles.thread}>
			<div
				style={{
					display: "flex",
					flexDirection: "column-reverse",
				}}
			>
				{messages.map((message) => (
					<div className={styles.messageContainer} key={message._id}>
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
			{messages.length !== totalMessages && (
				<button
					className={styles.loadMoreButton}
					onClick={() => loadMore()}
				>
					Load More...
				</button>
			)}
		</div>
	);
};

export default MessageThread;
