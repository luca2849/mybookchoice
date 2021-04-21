import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./MessageThread.module.css";

const MessageThread = ({ messages, me, getMessages, selectedThread }) => {
	const [hasMore, setHasMore] = useState(true);
	const fetchMore = (page) => {
		if (messages.length % 10 === 0 && hasMore) {
			getMessages(selectedThread, 10, page * 10);
		} else {
			setHasMore(false);
		}
	};
	if (messages.length < 1) return <p>Loading...</p>;
	return (
		<div className={styles.thread}>
			<InfiniteScroll
				isReverse={true}
				hasMore={hasMore}
				loadMore={fetchMore}
				style={{ display: "flex", flexDirection: "column-reverse" }}
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
			</InfiniteScroll>
		</div>
	);
};

export default MessageThread;
