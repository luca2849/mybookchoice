import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import styles from "./UserProfile.module.css";
// Action
import { getUser, sendFriendRequest, removeFriend } from "../../actions/user";
// Components
import Loading from "../../Components/Misc/Loading/Loading";
import BreadCrumb from "../../Components/BreadCrumb/BreadCrumb";
import ReactMapGL from "react-map-gl";
// Helpers
import calculateRatings from "../../utils/calculateRatings";

const UserProfile = ({
	userState: { loading, user },
	getUser,
	sendFriendRequest,
	removeFriend,
	authState: { loading: authLoading, user: currentUser },
}) => {
	const userParam = useParams().user;
	const [viewport, setViewport] = React.useState({
		latitude: 51.438747,
		longitude: -3.174008,
		zoom: 8,
	});
	useEffect(() => {
		getUser(userParam);
	}, []);

	if (loading || authLoading || !user || !currentUser) return <Loading />;

	const handleRemoveFriend = () => {
		console.log(user.username);
		removeFriend(user.username);
	};

	const handleFriendRequest = () => {
		sendFriendRequest(user.username);
	};

	const mostRecentFriend =
		user.friends.length > 0
			? user.friends.sort(
					(a, b) => new Date(a.since) - new Date(b.since)
			  )[0]
			: null;

	const areFriends =
		user.friends.map(
			(friend) => friend.user.username === currentUser.username && true
		).length === 1;
	// Get counts for each type of rating
	const [likes, notread, dislikes] = calculateRatings(user.ratings);
	return (
		<div>
			<BreadCrumb cssClass={styles.breadcrumb}>
				<BreadCrumb.Item>Profiles</BreadCrumb.Item>
				<BreadCrumb.Item>{user.username}'s Profile</BreadCrumb.Item>
			</BreadCrumb>
			<div className={styles.main}>
				<div className={styles.left}>
					<div className={styles.map}>
						<ReactMapGL
							{...viewport}
							width="100%"
							height="100%"
							mapboxApiAccessToken={
								process.env.REACT_APP_MAPBOX_TOKEN
							}
							onViewportChange={(viewport) =>
								setViewport(viewport)
							}
						/>
					</div>
					<div className={styles.imageContainer}>
						<div className={styles.avatar}>
							<img
								src={
									user.profileImage.imageType === "EXTERNAL"
										? user.profileImage.url
										: `${process.env.REACT_APP_SERVER_URL}/api/img/${user.profileImage.url}`
								}
							/>
						</div>
						<h2>@{user.username}</h2>
					</div>
					<div className={styles.divider}>
						<p>Basic Information</p>
					</div>
					<section className={styles.basicInfo}>
						<div className={styles.infoGroup}>
							<p>Name: </p>
							<p>{user.name}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>E-Mail: </p>
							<p>{user.email}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Registered: </p>
							<p>
								{moment(user.registered).format(
									"DD/MM/YYYY HH:mm:ss"
								)}
							</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Updated: </p>
							<p>
								{moment(user.updatedAt).format(
									"DD/MM/YYYY HH:mm:ss"
								)}
							</p>
						</div>
					</section>
					<div className={styles.divider}>
						<p>Friends</p>
					</div>
					<section className={styles.basicInfo}>
						<div className={styles.infoGroup}>
							<p>Friend Count: </p>
							<p>{user.friends.length}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Newest Friend: </p>
							<p>
								{user.friends.length === 0
									? "N/A"
									: mostRecentFriend.user.name}
							</p>
						</div>
					</section>
				</div>
				<div className={styles.right}>
					{user._id !== currentUser._id && (
						<>
							<div className={styles.divider}>
								<p>Actions</p>
							</div>
							<div className={styles.buttonContainer}>
								{areFriends ? (
									<button
										className={styles.remove}
										onClick={() => handleRemoveFriend()}
									>
										Remove Friend
									</button>
								) : (
									<button
										className={styles.add}
										onClick={() => handleFriendRequest()}
									>
										Send Friend Request
									</button>
								)}
							</div>
						</>
					)}
					<div className={styles.divider}>
						<p>Ratings</p>
					</div>
					<section className={styles.basicInfo}>
						<div className={styles.infoGroup}>
							<p>Books Rated: </p>
							<p>{likes + notread + dislikes}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Books Liked: </p>
							<p>{likes}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Books Disliked: </p>
							<p>{dislikes}</p>
						</div>
						<div className={styles.infoGroup}>
							<p>Books Not Read: </p>
							<p>{notread}</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	userState: state.user,
	authState: state.auth,
});

export default connect(mapStateToProps, {
	getUser,
	sendFriendRequest,
	removeFriend,
})(UserProfile);
