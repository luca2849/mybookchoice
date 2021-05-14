import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./Friends.module.css";

import { getFriends } from "../../actions/user";
import List from "../../Components/List/List";
import Loading from "../../Components/Misc/Loading/Loading";

const Friends = ({ auth: { user, loading } }) => {
	if (loading) return <Loading />;
	return (
		<div className={styles.mainContainer}>
			<h3>Friends List</h3>
			<List cssClass={styles.list}>
				{user.friends.length === 0 ? (
					<List.Item>
						<p>No Friends Found.</p>
					</List.Item>
				) : (
					user.friends.map((friend, i) => (
						<List.Item cssClass={styles.item} key={i}>
							<Link to={`/user/${friend.user.username}`}>
								<div className={styles.image}>
									<img
										alt="Profile"
										src={
											friend.user.profileImage
												.imageType === "EXTERNAL"
												? friend.user.profileImage.url
												: `${process.env.REACT_APP_SERVER_URL}/api/img/${friend.user.profileImage.url}`
										}
									/>
								</div>
								{friend.user.name} ({friend.user.username})
							</Link>
						</List.Item>
					))
				)}
			</List>
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { getFriends })(Friends);
