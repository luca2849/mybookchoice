import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./PasswordReset.module.css";

import { requestPasswordReset } from "../../actions/user";
import { GrClose } from "react-icons/gr";
import Modal from "../Modal/Modal";

const PasswordReset = ({ isOpen, clickHandler, requestPasswordReset }) => {
	const [formData, setFormData] = useState({
		email: null,
	});
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const onSubmit = () => {
		requestPasswordReset(formData);
		clickHandler(null);
	};
	return (
		<>
			<Modal
				cssClass={styles.modal}
				openHandler={clickHandler}
				open={isOpen}
			>
				<h3>Reset Password</h3>
				<GrClose
					onClick={() => clickHandler(null)}
					className={styles.close}
				/>
				<div className={styles.form}>
					<div className={styles.formGroup}>
						<input
							type="text"
							name="email"
							placeholder="Email..."
							onChange={(e) => handleChange(e)}
							value={formData.email}
						/>
					</div>
					<div className={styles.submitContainer}>
						<button onClick={() => onSubmit()}>
							Reset Password
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default connect(null, { requestPasswordReset })(PasswordReset);
