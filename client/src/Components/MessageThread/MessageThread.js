import React, { useState } from "react";
import styles from "./MessageThread.module.css";

import Loading from "../../Components/Misc/Loading/Loading";

const MessageThread = ({
	messages,
	totalMessages,
	loading,
	me,
	getMessages,
	selectedThread,
}) => {
	const [page, setPage] = useState(2);
	const loadMore = () => {
		if (messages.length !== totalMessages) {
			getMessages(selectedThread, 10, page * 10);
			setPage(page + 1);
		}
	};
	return (
		<div className={styles.thread}>
			{loading ? (
				<Loading />
			) : (
				<>
					<div
						style={{
							display: "flex",
							flexDirection: "column-reverse",
						}}
					>
						{messages.map((message) => (
							<div
								className={styles.messageContainer}
								key={message._id}
							>
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
				</>
			)}
		</div>
	);
};

export default MessageThread;
