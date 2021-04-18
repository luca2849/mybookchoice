import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Loading from "../../Components/Misc/Loading/Loading";
import List from "../../Components/List/List";

import styles from "./Notifications.module.css";

import { getNotifications, respondToRequest } from "../../actions/user";

import { BsCheck } from "react-icons/bs";
import { GrClose } from "react-icons/gr";

const Notifications = ({
	getNotifications,
	respondToRequest,
	userState: { notifications, loading },
}) => {
	useEffect(() => {
		getNotifications(10, 0);
	}, []);
	const handleClick = (notification, remoteUser, response) => {
		respondToRequest(notification, remoteUser, response, 1, 0);
	};
	console.log(notifications);
	if (loading) return <Loading />;
	return (
		<div>
			<h3>Notifications</h3>
			<List>
				{notifications.map((notification) => (
					<>
						<List.Item cssClass={styles.item}>
							{notification.type === "FRIEND_REQUEST" && (
								<p>
									You have recieved a friend request from{" "}
									<Link
										to={`/user/${notification.from.username}`}
									>
										{notification.from.username}
									</Link>
								</p>
							)}
							{notification.type === "FRIEND_REQUEST" &&
								notification.actioned === false && (
									<div className={styles.buttons}>
										<button
											onClick={() =>
												handleClick(
													notification._id,
													notification.from.username,
													true
												)
											}
										>
											<BsCheck />
										</button>
										<button
											onClick={() =>
												handleClick(
													notification._id,
													notification.from.username,
													false
												)
											}
										>
											<GrClose />
										</button>
									</div>
								)}
						</List.Item>
					</>
				))}
			</List>
		</div>
	);
};

const mapStateToProps = (state) => ({
	userState: state.user,
});

export default connect(mapStateToProps, { getNotifications, respondToRequest })(
	Notifications
);
