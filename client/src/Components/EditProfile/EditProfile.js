import React, { useState } from "react";
import { connect } from "react-redux";
import { editProfile, changeProfilePicture } from "../../actions/user";
import { GrClose } from "react-icons/gr";
import ImageUploader from "react-images-upload";
import moment from "moment";
import styles from "./EditProfile.module.css";

const EditProfile = ({
	clickHandler,
	user,
	editProfile,
	changeProfilePicture,
}) => {
	const [formData, setFormData] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		dob: moment(user.dob, "YYYY-MM-DD[T00:00:00.000Z]").format(
			"YYYY-MM-DD"
		),
		profileImage: user.profileImage,
	});
	const [picture, setPicture] = useState(null);
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const onDrop = async (picture) => {
		setPicture(picture);
	};
	const onSubmit = () => {
		editProfile(formData);
		if (picture) {
			changeProfilePicture(picture);
		}
	};
	return (
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
					<p>Date of Birth</p>
					<input
						type="date"
						name="dob"
						onChange={(e) => handleChange(e)}
						value={formData.dob}
					/>
				</div>
				<div className={styles.formGroup}>
					<p>Profile Image</p>
					<ImageUploader
						withIcon={false}
						buttonText="Choose images"
						onChange={onDrop}
						imgExtension={[".jpg", ".gif", ".png"]}
						buttonText={"Choose picture"}
						label={null}
						maxFileSize={5242880}
						singleImage={true}
						withPreview={true}
						className={styles.imageUpload}
						name={"profileImage"}
					/>
				</div>
				<div className={styles.submitContainer}>
					<button onClick={() => onSubmit()}>Save</button>
				</div>
			</div>
		</div>
	);
};

export default connect(null, { editProfile, changeProfilePicture })(
	EditProfile
);
