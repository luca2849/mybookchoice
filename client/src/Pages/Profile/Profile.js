import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./Profile.module.css";

import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/BreadCrumb/BreadCrumb";
import List from "../../Components/List/List";
import Loading from "../../Components/Misc/Loading/Loading";
import EditProfile from "../../Components/EditProfile/EditProfile";

const Profile = ({ user }) => {
	const [editProfileOpen, setEditProfileOpen] = useState(false);
	if (!user) return <Loading />;
	return (
		<div className={styles.profile}>
			{editProfileOpen && (
				<EditProfile clickHandler={setEditProfileOpen} user={user} />
			)}
			<BreadCrumb>
				<BreadCrumb.Item>
					<Link to={"/home"}>Home</Link>
				</BreadCrumb.Item>
				<BreadCrumb.Item>
					<Link to={"/profile"}>Profile</Link>
				</BreadCrumb.Item>
			</BreadCrumb>
			<div className={styles.profileContainer}>
				<div className={styles.userSection}>
					<div className={styles.imageContainer}>
						<img src={`/${user.profileImage}`} />
					</div>
					<h3>{user.username}</h3>
				</div>
				<div className={styles.actions}>
					<h3>My Account</h3>
					<List>
						<List.Item>
							<Link to={"/recommendations"}>
								My Recommendations
							</Link>
						</List.Item>
						<List.Item>My Past Ratings</List.Item>
						<List.Item>My Friends</List.Item>
						<List.Item>My Messages</List.Item>
						<List.Item>My Reviews</List.Item>
					</List>
					<h3>Account Settings</h3>
					<List>
						<List.Item>Password Reset</List.Item>
						<List.Item onClick={() => setEditProfileOpen(true)}>
							Edit Profile
						</List.Item>
						<List.Item>
							<Link to={"/logout"}>Log Out</Link>
						</List.Item>
						<List.Item>Delete My Account</List.Item>
					</List>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, null)(Profile);
