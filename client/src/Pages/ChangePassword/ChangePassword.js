import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import LandingNavigation from "../../Components/Navigation/LandingNavigation/LandingNavigation";
import styles from "./ChangePassword.module.css";

import { changePassword } from "../../actions/user";

const ChangePassword = ({ changePassword, location }) => {
	const token = new URLSearchParams(location.search).get("t");
	const history = useHistory();
	const [formData, setFormData] = useState({
		password: "",
		confirmation: "",
	});
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleSubmit = (formData, token) => {
		changePassword(formData, token);
		history.push("/");
	};
	return (
		<LandingNavigation>
			<div className={styles.changePassword}>
				<div className={styles.resetForm}>
					<h2>Change Password</h2>
					<div className={styles.formGroup}>
						<p>New Password</p>
						<input
							type="password"
							name="password"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className={styles.formGroup}>
						<p>Confirm Password</p>
						<input
							type="password"
							name="confirmation"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className={styles.buttonContainer}>
						<button onClick={() => handleSubmit(formData, token)}>
							Update Password
						</button>
					</div>
				</div>
			</div>
		</LandingNavigation>
	);
};

export default connect(null, { changePassword })(ChangePassword);
