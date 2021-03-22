import React, { useState } from "react";
import { connect } from "react-redux";
import { editProfile } from "../../actions/user";
import { GrClose } from "react-icons/gr";
import styles from "./EditProfile.module.css";

const EditProfile = ({ clickHandler, user, editProfile }) => {
	const [formData, setFormData] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
	});
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	return (
		<>
			<div
				onClick={() => clickHandler(false)}
				className={styles.darkenContainer}
			></div>
			<div className={styles.modal}>
				<h3>Edit Profile</h3>
				<GrClose
					onClick={() => clickHandler(false)}
					className={styles.close}
				/>
				<div className={styles.form}>
					<div className={styles.formGroup}>
						<p>Name</p>
						<input
							type="text"
							name="name"
							onChange={(e) => handleChange(e)}
							value={formData.name}
						/>
					</div>
					<div className={styles.formGroup}>
						<p>Username</p>
						<input
							type="text"
							name="username"
							onChange={(e) => handleChange(e)}
							value={formData.username}
						/>
					</div>
					<div className={styles.formGroup}>
						<p>E-Mail</p>
						<input
							type="text"
							name="email"
							onChange={(e) => handleChange(e)}
							value={formData.email}
						/>
					</div>
					<div className={styles.formGroup}>
						<p>Profile Image</p>
						<input type="file" />
					</div>
					<div className={styles.submitContainer}>
						<button onClick={() => editProfile(formData)}>
							Save
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default connect(null, { editProfile })(EditProfile);
