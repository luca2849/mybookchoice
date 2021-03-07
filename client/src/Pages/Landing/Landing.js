import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { login } from "../..//actions/auth";
import styles from "./Landing.module.css";

// Icons
import { BsArrowLeft, BsX } from "react-icons/bs";

import Logo from "../../Components/Misc/Logo/Logo";
import LandingNavigation from "../../Components/Navigation/LandingNavigation/LandingNavigation";

const Landing = ({ login, isAuthenticated }) => {
	const [loginData, setLoginData] = useState({});
	const [currentModal, setCurrentModal] = useState(null);

	//Redirect if authenticated
	if (isAuthenticated) {
		return <Redirect to="/home" />;
	}

	const handleLoginDataChange = (e) => {
		setLoginData({ ...loginData, [e.target.name]: e.target.value });
	};

	const handleLoginSubmit = () => {
		login(loginData);
	};

	return (
		<LandingNavigation>
			{currentModal && (
				<>
					<div
						className={styles.darken}
						onClick={() => setCurrentModal(null)}
					></div>
					{currentModal === "login" && (
						<div className={`${styles.loginModal} ${styles.modal}`}>
							<div className={styles.headerButtons}>
								<BsArrowLeft style={{ opacity: "0" }} />
								<Logo
									fill={"#808080"}
									className={styles.logo}
								/>
								<BsX
									className={styles.closeButton}
									onClick={() => setCurrentModal(null)}
								/>
							</div>
							<h1>Please Enter Your Details</h1>
							<div className={styles.form}>
								<input
									type="text"
									name="email"
									placeholder="Email..."
									// value={loginData.email || ""}
									onChange={(e) => handleLoginDataChange(e)}
								/>
								<input
									type="password"
									name="password"
									placeholder="Password..."
									// value={loginData.password || ""}
									onChange={(e) => handleLoginDataChange(e)}
								/>
								<button onClick={() => handleLoginSubmit()}>
									Login
								</button>
							</div>
						</div>
					)}
				</>
			)}

			<div className={styles.hero}>
				<h1>
					Get Quick and Easy Book <br />
					Recommendations
				</h1>
				<div className={styles.buttonsContainer}>
					<button>Register</button>
					<button onClick={() => setCurrentModal("login")}>
						Login
					</button>
				</div>
			</div>
		</LandingNavigation>
	);
};

Landing.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Landing);
