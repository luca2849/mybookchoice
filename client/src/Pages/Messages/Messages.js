import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import styles from "./Messages.module.css";

// Components
import ThreadItem from "../../Components/ThreadItem/ThreadItem";
import MessageThread from "../../Components/MessageThread/MessageThread";
import ThreadHeader from "../../Components/ThreadHeader/ThreadHeader";
import Loading from "../../Components/Misc/Loading/Loading";

// Actions
import { getThreads, getMessages } from "../../actions/messaging";

const Messages = ({
	messagesState: { loading, threads, messages },
	authState: { user: me },
	getThreads,
	getMessages,
}) => {
	const [selectedThread, setSelectedThread] = useState(null);

	useEffect(() => {
		getThreads(10, 0);
	}, []);

	useEffect(() => {
		if (selectedThread !== null) getMessages(selectedThread, 10, 0);
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
			<p>Messages Page</p>
			<div className={styles.messagesContainer}>
				<div className={styles.threads}>
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
								{loading && messages.length === 0 ? (
									<Loading />
								) : (
									<MessageThread
										messages={messages}
										me={me._id}
										getMessages={getMessages}
										selectedThread={selectedThread}
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

export default connect(mapStateToProps, { getThreads, getMessages })(Messages);
