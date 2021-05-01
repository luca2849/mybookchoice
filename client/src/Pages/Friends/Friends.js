import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import styles from "./Friends.module.css";

import { getFriends } from "../../actions/user";
import List from "../../Components/List/List";
import Loading from "../../Components/Misc/Loading/Loading";

const Friends = ({ getFriends, user: { friends, loading } }) => {
	useEffect(() => {
		getFriends(10, 0);
	}, [getFriends]);
	if (loading) return <Loading />;
	return (
		<div className={styles.mainContainer}>
			<h3>Friends List</h3>
			<List cssClass={styles.list}>
				{friends.map((friend) => (
					<List.Item cssClass={styles.item}>
						<Link to={`/user/${friend.user.username}`}>
							<div className={styles.image}>
								<img
									alt="Profile"
									src={
										friend.user.profileImage.imageType ===
										"EXTERNAL"
											? friend.user.profileImage.url
											: `${process.env.REACT_APP_SERVER_URL}/api/img/${friend.user.profileImage.url}`
									}
								/>
							</div>
							{friend.user.name} ({friend.user.username})
						</Link>
					</List.Item>
				))}
			</List>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, { getFriends })(Friends);
