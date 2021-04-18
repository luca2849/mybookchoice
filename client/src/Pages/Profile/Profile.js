import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./Profile.module.css";
import { deleteUser } from "../../actions/auth";
import { requestPasswordReset } from "../../actions/user";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/BreadCrumb/BreadCrumb";
import List from "../../Components/List/List";
import Loading from "../../Components/Misc/Loading/Loading";
import EditProfile from "../../Components/EditProfile/EditProfile";
import PasswordReset from "../../Components/PasswordReset/PasswordReset";
import { toast } from "react-toastify";
import setAuthToken from "../../utils/setAuthToken";
import Modal from "../../Components/Modal/Modal";

const Profile = ({ user, deleteUser, requestPasswordReset }) => {
	setAuthToken(localStorage.getItem("token"));
	const [editProfileOpen, setEditProfileOpen] = useState(false);
	const [currentModal, setCurrentModal] = useState(null);
	const [modalOpen, setModalOpen] = useState(true);
	const [username, setUsername] = useState("");
	if (!user) return <Loading />;

	const handleUserChange = (e) => {
		setUsername(e.target.value);
	};

	const handleSubmit = () => {
		if (username !== user.username) {
			toast.error("Username is incorrect");
			return;
		}
		deleteUser();
	};

	return (
		<div className={styles.profile}>
			<Modal
				open={!!editProfileOpen}
				openHandler={setEditProfileOpen}
				cssClass={styles.modal}
				stopScroll={false}
			>
				<EditProfile clickHandler={setEditProfileOpen} user={user} />
			</Modal>
			{currentModal && (
				<>
					<Modal
						open={currentModal === "deleteAcc"}
						openHandler={setCurrentModal}
						cssClass={styles.modal}
					>
						<h3>Delete Account</h3>
						<p>
							Deleting your account is an irreversible operation.
							You will not be able to retrieve any of your data.
						</p>
						<p>
							All of your personal information, ratings, reviews,
							and preferences will be deleted.
						</p>
						<div className={styles.buttons}>
							<button onClick={() => setCurrentModal(null)}>
								Cancel
							</button>
							<button
								onClick={() => setCurrentModal("deleteAccConf")}
							>
								Delete Account
							</button>
						</div>
					</Modal>
					<Modal
						open={currentModal === "deleteAccConf"}
						openHandler={() => setCurrentModal(null)}
						cssClass={styles.modal}
					>
						<h3>Delete Account</h3>
						<p>
							Please enter your username,{" "}
							<span className={styles.name}>{user.username}</span>
							, below to confirm your account deletion.
						</p>
						<div className={styles.formGroup}>
							<input
								onChange={(e) => handleUserChange(e)}
								placeholder="Username..."
								type="text"
								name="username"
								autoComplete="off"
							/>
						</div>
						<div className={styles.buttons}>
							<button onClick={() => setCurrentModal(null)}>
								Cancel
							</button>
							<button onClick={() => handleSubmit()}>
								Delete Account
							</button>
						</div>
					</Modal>
					<PasswordReset
						isOpen={currentModal === "passwordChange"}
						clickHandler={setCurrentModal}
						requestPasswordReset={requestPasswordReset}
					/>
				</>
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
						<img
							src={
								user.profileImage.imageType === "EXTERNAL"
									? user.profileImage.url
									: `${process.env.REACT_APP_SERVER_URL}/api/img/${user.profileImage.url}`
							}
						/>
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
						<Link to={"/ratings"}>
							<List.Item>My Past Ratings</List.Item>
						</Link>
						<Link to={"/recommend"}>
							<List.Item>Get Specific Recommendation</List.Item>
						</Link>
						<Link to={"/notifications"}>
							<List.Item>My Notifications</List.Item>
						</Link>
						<List.Item>My Friends</List.Item>
						<List.Item>My Messages</List.Item>
						<List.Item>My Reviews</List.Item>
					</List>
					<h3>Account Settings</h3>
					<List>
						<List.Item
							onClick={() => setCurrentModal("passwordChange")}
						>
							Password Reset
						</List.Item>
						<List.Item onClick={() => setEditProfileOpen(true)}>
							Edit Profile
						</List.Item>
						<List.Item>
							<Link to={"/logout"}>Log Out</Link>
						</List.Item>
						<List.Item onClick={() => setCurrentModal("deleteAcc")}>
							<span style={{ color: "red" }}>
								Delete My Account
							</span>
						</List.Item>
					</List>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, { deleteUser, requestPasswordReset })(
	Profile
);
