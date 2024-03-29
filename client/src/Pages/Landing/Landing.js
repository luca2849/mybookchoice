import React, { useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
// Redux
import { connect } from "react-redux";
import {
	login,
	register,
	authenticateWithGoogle,
	authenticateWithFacebook,
} from "../../actions/auth";
// CSS
import styles from "./Landing.module.css";
// Icons
import { BsArrowLeft, BsX } from "react-icons/bs";
import { AiFillFacebook, AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BiArrowBack } from "react-icons/bi";
// Components
import Logo from "../../Components/Misc/Logo/Logo";
import PasswordReset from "../../Components/PasswordReset/PasswordReset";
import LandingNavigation from "../../Components/Navigation/LandingNavigation/LandingNavigation";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import Modal from "../../Components/Modal/Modal";

const Landing = ({
	login,
	register,
	isAuthenticated,
	authenticateWithGoogle,
	authenticateWithFacebook,
}) => {
	const [loginData, setLoginData] = useState({});
	const [registrationData, setRegistrationData] = useState({
		email: "",
		name: "",
		username: "",
		password: "",
		confirmation: "",
		dob: "",
	});
	const [currentModal, setCurrentModal] = useState(null);

	//Redirect if authenticated
	if (isAuthenticated) {
		return <Redirect to="/home" />;
	}

	const handleLoginDataChange = (e) => {
		setLoginData({ ...loginData, [e.target.name]: e.target.value });
	};

	const handleRegistrationDataChange = (e) => {
		setRegistrationData({
			...registrationData,
			[e.target.name]: e.target.value,
		});
	};

	const handleRegisterSubmit = () => {
		register(registrationData);
	};

	const handleLoginSubmit = () => {
		login(loginData);
	};

	const googleSuccess = async (response) => {
		try {
			authenticateWithGoogle(response);
		} catch (error) {
			console.error(error);
		}
	};
	const googleFailure = () => {
		toast.error("Google sign in error. Please try again later.", {
			autoClose: 3000,
		});
		console.error("Google Sign In Error. Try again later.");
	};

	const facebookResponse = async (response) => {
		authenticateWithFacebook(response.accessToken, response.id);
	};
	return (
		<LandingNavigation>
			<Modal
				open={currentModal && currentModal === "login"}
				openHandler={setCurrentModal}
				cssClass={styles.loginModal}
			>
				<div className={styles.headerButtons}>
					<BsArrowLeft style={{ opacity: "0" }} />
					<Logo fill={"#808080"} className={styles.logo} />
					<BsX
						className={styles.closeButton}
						onClick={() => setCurrentModal(null)}
					/>
				</div>
				<h3>Please Enter Your Details</h3>
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
					<div className={styles.forgotContainer}>
						<p
							className={styles.forgot}
							onClick={() => setCurrentModal("password")}
						>
							Forgotten your password?
						</p>
					</div>
					<button onClick={() => handleLoginSubmit()}>Login</button>
					<GoogleLogin
						clientId={
							"380870297062-taklr4637g8ur6srf482fk7qjcedhm5p.apps.googleusercontent.com"
						}
						render={(renderProps) => (
							<div className={styles.googleOuter}>
								<div
									className={styles.googleLogin}
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}
								>
									<FcGoogle />
									<p>Login with Google</p>
								</div>
							</div>
						)}
						onSuccess={googleSuccess}
						onFailure={googleFailure}
						scope={
							"profile email https://www.googleapis.com/auth/user.birthday.read"
						}
						cookiePolicy="single_host_origin"
					/>
					<FacebookLogin
						appId="771508680171352"
						tag="div"
						icon={<AiFillFacebook />}
						cssClass={styles.fbLogin}
						fields="name,email,picture,hometown"
						callback={facebookResponse}
					/>
				</div>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg0"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationMethods
					googleSuccess={googleSuccess}
					googleFailure={googleFailure}
					facebookResponse={facebookResponse}
					clickHandler={setCurrentModal}
					dataHandler={handleRegistrationDataChange}
				/>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg1"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationEmail
					clickHandler={setCurrentModal}
					dataHandler={handleRegistrationDataChange}
					data={registrationData}
				/>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg2"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationName
					clickHandler={setCurrentModal}
					dataHandler={handleRegistrationDataChange}
					data={registrationData}
				/>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg3"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationPassword
					clickHandler={setCurrentModal}
					dataHandler={handleRegistrationDataChange}
					data={registrationData}
				/>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg4"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationDOB
					clickHandler={setCurrentModal}
					dataHandler={handleRegistrationDataChange}
					data={registrationData}
				/>
			</Modal>
			<Modal
				open={currentModal && currentModal === "reg5"}
				openHandler={setCurrentModal}
				cssClass={styles.modal}
			>
				<RegistrationConfirmation
					clickHandler={setCurrentModal}
					data={registrationData}
					handleRegister={handleRegisterSubmit}
				/>
			</Modal>
			<PasswordReset
				isOpen={currentModal && currentModal === "password"}
				clickHandler={setCurrentModal}
			/>
			<div className={styles.hero}>
				<h1>
					Get Quick and Easy Book <br />
					Recommendations
				</h1>
				<div className={styles.buttonsContainer}>
					<button onClick={() => setCurrentModal("reg0")}>
						Register
					</button>
					<button onClick={() => setCurrentModal("login")}>
						Login
					</button>
				</div>
			</div>
		</LandingNavigation>
	);
};

const RegistrationMethods = ({
	clickHandler,
	googleSuccess,
	googleFailure,
	facebookResponse,
}) => {
	return (
		<>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>Create Account</h3>
			<div className={styles.items}>
				<FacebookLogin
					appId="771508680171352"
					icon={<AiFillFacebook />}
					cssClass={styles.item}
					fields="name,email,picture,hometown"
					callback={facebookResponse}
				/>
				<GoogleLogin
					clientId={
						"380870297062-taklr4637g8ur6srf482fk7qjcedhm5p.apps.googleusercontent.com"
					}
					render={(renderProps) => (
						<div
							className={styles.item}
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
						>
							<FcGoogle />
							<p>Register with Google</p>
						</div>
					)}
					onSuccess={googleSuccess}
					onFailure={googleFailure}
					scope={
						"profile email https://www.googleapis.com/auth/user.birthday.read"
					}
					cookiePolicy="single_host_origin"
				/>
				{/* <div className={styles.item} onClick={googleLogin}>
					<FcGoogle />
					<p>Register with Google</p>
				</div> */}
				{/* <div className={styles.item}>
					<AiFillTwitterCircle />
					<p>Register with Twitter</p>
				</div> */}
				<div
					className={styles.item}
					onClick={() => clickHandler("reg1")}
				>
					<AiOutlineMail />
					<p>Register with E-Mail</p>
				</div>
			</div>
		</>
	);
};

const RegistrationEmail = ({ dataHandler, clickHandler, data }) => {
	const validate = () => {
		const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let errors = [];
		if (!data.email) {
			errors.push("E-Mail is required");
		}
		if (!emailReg.exec(data.email)) {
			errors.push("A valid E-Mail is required");
		}
		if (errors.length > 0) {
			errors.forEach((err) => toast.error(err));
			return;
		}
		clickHandler("reg2");
	};
	return (
		<>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<BiArrowBack
				className={styles.back}
				onClick={() => clickHandler("reg0")}
			/>
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>What's your e-mail?</h3>
			<div className={styles.form}>
				<input
					type="text"
					name="email"
					placeholder="Email..."
					value={data.email || ""}
					onChange={(e) => dataHandler(e)}
				/>
				<button onClick={() => validate()}>Continue</button>
			</div>
		</>
	);
};

const RegistrationName = ({ dataHandler, clickHandler, data }) => {
	const validate = () => {
		let errors = [];
		if (!data.name) {
			errors.push("Name is required");
		} else if (data.name.length < 6) {
			errors.push("Name must be at least 6 characters");
		}
		if (!data.username) {
			errors.push("Username is required");
		} else if (data.username.length < 6) {
			errors.push("Username must be at least 6 characters");
		}
		if (errors.length > 0) {
			errors.forEach((err) => toast.error(err));
			return;
		}
		clickHandler("reg3");
	};
	return (
		<>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<BiArrowBack
				className={styles.back}
				onClick={() => clickHandler("reg1")}
			/>
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>What should we call you?</h3>
			<div className={styles.form}>
				<input
					type="text"
					name="name"
					placeholder="Full Name..."
					value={data.name || ""}
					onChange={(e) => dataHandler(e)}
				/>
				<input
					type="text"
					name="username"
					placeholder="Username..."
					value={data.username || ""}
					onChange={(e) => dataHandler(e)}
				/>
				<button onClick={() => validate()}>Continue</button>
			</div>
		</>
	);
};

const RegistrationPassword = ({ dataHandler, clickHandler, data }) => {
	const validator = () => {
		const passRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])/;
		let errors = [];
		if (!data.password) {
			errors.push("Password is required");
		}
		if (!passRegex.exec(data.password) || data.password.length < 6) {
			errors.push("Password does not match the requried format");
		}
		if (data.password !== data.confirmation) {
			errors.push("Passwords do not match");
		}
		if (errors.length > 0) {
			errors.forEach((err) => toast.error(err));
			return;
		}
		clickHandler("reg4");
	};
	return (
		<div className={styles.modal}>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<BiArrowBack
				className={styles.back}
				onClick={() => clickHandler("reg2")}
			/>
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>Now, Enter a Secure Password</h3>
			<p>
				Your password must contain at least one upper-case letter,
				lower-case letter, number and symbol
			</p>
			<div className={styles.form}>
				<input
					type="password"
					name="password"
					placeholder="Password..."
					value={data.password || ""}
					onChange={(e) => dataHandler(e)}
				/>
				<input
					type="password"
					name="confirmation"
					placeholder="Password Confirmation..."
					value={data.confirmation || ""}
					onChange={(e) => dataHandler(e)}
				/>
				<button onClick={() => validator()}>Continue</button>
			</div>
		</div>
	);
};

const RegistrationDOB = ({ dataHandler, clickHandler, data }) => {
	const validate = () => {
		const dob = moment(data.dob, "YYYY-MM-DD[T00:00:00.000Z]");
		const now = moment();
		const diff = dob.diff(now, "years");
		if (!data.dob) {
			toast.error("Date of birth is required");
			return;
		}
		if (Math.abs(diff) < 18) {
			toast.error("You must be 18 years old to use this service.");
			return;
		}
		clickHandler("reg5");
	};
	return (
		<div className={styles.modal}>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<BiArrowBack
				className={styles.back}
				onClick={() => clickHandler("reg3")}
			/>
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>When were you born?</h3>
			<div className={styles.form}>
				<input
					type="date"
					name="dob"
					value={moment(
						data.dob,
						"YYYY-MM-DD[T00:00:00.000Z]"
					).format("YYYY-MM-DD")}
					onChange={(e) => dataHandler(e)}
				/>
				<button onClick={() => validate()}>Continue</button>
			</div>
		</div>
	);
};

const RegistrationConfirmation = ({ data, clickHandler, handleRegister }) => {
	const items = ["email", "name", "username", "dob"];
	return (
		<div className={styles.modal}>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<BiArrowBack
				className={styles.back}
				onClick={() => clickHandler("reg4")}
			/>
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>Here's what we've got.</h3>
			<div className={styles.confItem}>
				{items.map((key, index) => (
					<p key={index}>
						<span className={styles.key}>{key}</span> -{" "}
						<b>{data[key]}</b>
					</p>
				))}
			</div>
			<div className={styles.form}>
				<button onClick={() => handleRegister()}>Continue</button>
			</div>
		</div>
	);
};

Landing.propTypes = {
	login: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
	login,
	register,
	authenticateWithGoogle,
	authenticateWithFacebook,
})(Landing);
