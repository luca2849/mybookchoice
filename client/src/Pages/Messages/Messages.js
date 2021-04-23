import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import styles from "./Messages.module.css";

// Components
import ThreadItem from "../../Components/ThreadItem/ThreadItem";
import ThreadInput from "../../Components/ThreadInput/ThreadInput";
import MessagesHeader from "../../Components/MessagesHeader/MessagesHeader";
import MessageThread from "../../Components/MessageThread/MessageThread";
import ThreadHeader from "../../Components/ThreadHeader/ThreadHeader";
import Loading from "../../Components/Misc/Loading/Loading";

// Actions
import { getThreads, getMessages, createThread } from "../../actions/messaging";

const Messages = ({
	messagesState: { loading, threads, messages },
	authState: { user: me, loading: authLoading },
	getThreads,
	getMessages,
	createThread,
}) => {
	const [selectedThread, setSelectedThread] = useState(null);

	useEffect(() => {
		getThreads(10, 0);
	}, []);

	useEffect(() => {
		if (selectedThread !== null) getMessages(selectedThread, 20, 0);
	}, [selectedThread]);

	const handleClick = (id) => {
		if (selectedThread === id) {
			setSelectedThread(null);
			return;
		}
		setSelectedThread(id);
	};
	return (
		<div>
			<div className={styles.messagesContainer}>
				<div className={styles.threads}>
					{authLoading ? (
						<Loading />
					) : (
						<MessagesHeader
							friends={me.friends}
							createThread={createThread}
						/>
					)}

					{threads.map((thread) => (
						<div key={thread._id}>
							<ThreadItem
								thread={thread}
								me={me._id}
								onClick={() => handleClick(thread._id)}
								isSelected={thread._id === selectedThread}
							/>
							<hr className={styles.divider} />
						</div>
					))}
				</div>
				<div className={styles.messages}>
					{selectedThread && (
						<>
							<ThreadHeader
								thread={
									threads.filter(
										(thread) =>
											thread._id === selectedThread
									)[0]
								}
								me={me._id}
							/>
							<>
								<MessageThread
									messages={messages.messages}
									totalMessages={messages.totalMessages}
									me={me._id}
									getMessages={getMessages}
									selectedThread={selectedThread}
									loading={loading}
								/>
								{authLoading ? (
									<Loading />
								) : (
									<ThreadInput
										selectedThread={selectedThread}
										me={me}
									/>
								)}
							</>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	messagesState: state.messaging,
	authState: state.auth,
});

export default connect(mapStateToProps, {
	getThreads,
	getMessages,
	createThread,
})(Messages);
