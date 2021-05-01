import React from "react";
import moment from "moment";

import styles from "./ThreadItem.module.css";

const ThreadItem = ({ thread, me, isSelected, onClick }) => {
	const otherUser = thread.users.filter((user) => user._id !== me)[0];
	return (
		<div
			className={`${styles.threadItem} ${
				isSelected ? styles.selected : ""
			}`}
			onClick={onClick}
		>
			<div className={styles.imageContainer}>
				<img
					alt="User"
					src={
						otherUser.profileImage.imageType === "EXTERNAL"
							? otherUser.profileImage.url
							: `${process.env.REACT_APP_SERVER_URL}/api/img/${otherUser.profileImage.url}`
					}
				/>
			</div>
			<div className={styles.threadInfo}>
				<div className={styles.names}>
					<p>{otherUser.name}</p>
					<p>{otherUser.username}</p>
				</div>
				<div className={styles.updated}>
					<p>{moment(thread.updatedAt).format("DD MMM")}</p>
				</div>
			</div>
		</div>
	);
};

export default ThreadItem;
