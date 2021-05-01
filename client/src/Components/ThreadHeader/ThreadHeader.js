import React from "react";
import moment from "moment";

import styles from "./ThreadHeader.module.css";

const ThreadHeader = ({ thread, me }) => {
	const otherUser = thread.users.filter((user) => user._id !== me)[0];
	return (
		<div className={styles.header}>
			<div className={styles.imageContainer}>
				<img
					alt="Thread User"
					src={
						otherUser.profileImage.imageType === "EXTERNAL"
							? otherUser.profileImage.url
							: `${process.env.REACT_APP_SERVER_URL}/api/img/${otherUser.profileImage.url}`
					}
				/>
			</div>
			<div className={styles.name}>
				<p>{otherUser.name}</p>
				<p>{otherUser.username}</p>
			</div>
			<div className={styles.updated}>
				<p>
					Last Message -{" "}
					{moment(thread.updatedAt).format("MMMM Do YYYY HH:mm A")}
				</p>
			</div>
		</div>
	);
};

export default ThreadHeader;
