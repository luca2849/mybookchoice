import React, { useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
// Redux
import { connect } from "react-redux";
import { login, register, authenticateWithGoogle } from "../../actions/auth";
// CSS
import styles from "./Landing.module.css";
// Icons
import { BsArrowLeft, BsX } from "react-icons/bs";
import {
	AiFillFacebook,
	AiFillTwitterCircle,
	AiOutlineMail,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BiArrowBack } from "react-icons/bi";
// Components
import Logo from "../../Components/Misc/Logo/Logo";
import PasswordReset from "../../Components/PasswordReset/PasswordReset";
import LandingNavigation from "../../Components/Navigation/LandingNavigation/LandingNavigation";
import GoogleLogin from "react-google-login";

const Landing = ({
	login,
	register,
	isAuthenticated,
	authenticateWithGoogle,
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
										onClick={() =>
											setCurrentModal("password")
										}
									>
										Forgotten your password?
									</p>
								</div>
								<button onClick={() => handleLoginSubmit()}>
									Login
								</button>
							</div>
						</div>
					)}
					{currentModal === "reg0" && (
						<RegistrationMethods
							authenticateWithGoogle={authenticateWithGoogle}
							clickHandler={setCurrentModal}
							dataHandler={handleRegistrationDataChange}
						/>
					)}
					{currentModal === "reg1" && (
						<RegistrationEmail
							clickHandler={setCurrentModal}
							dataHandler={handleRegistrationDataChange}
							data={registrationData}
						/>
					)}
					{currentModal === "reg2" && (
						<RegistrationName
							clickHandler={setCurrentModal}
							dataHandler={handleRegistrationDataChange}
							data={registrationData}
						/>
					)}
					{currentModal === "reg3" && (
						<RegistrationPassword
							clickHandler={setCurrentModal}
							dataHandler={handleRegistrationDataChange}
							data={registrationData}
						/>
					)}
					{currentModal === "reg4" && (
						<RegistrationDOB
							clickHandler={setCurrentModal}
							dataHandler={handleRegistrationDataChange}
							data={registrationData}
						/>
					)}
					{currentModal === "reg5" && (
						<RegistrationConfirmation
							clickHandler={setCurrentModal}
							data={registrationData}
							handleRegister={handleRegisterSubmit}
						/>
					)}
					{currentModal === "password" && (
						<PasswordReset clickHandler={setCurrentModal} />
					)}
				</>
			)}

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

const RegistrationMethods = ({ clickHandler, authenticateWithGoogle }) => {
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

	return (
		<div className={styles.modal}>
			<BsX className={styles.close} onClick={() => clickHandler(null)} />
			<Logo fill={"rgb(150, 150, 150)"} />
			<h3>Create Account</h3>
			<div className={styles.items}>
				<div className={styles.item}>
					<AiFillFacebook />
					<p>Register with Facebook</p>
				</div>
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
				<div className={styles.item}>
					<AiFillTwitterCircle />
					<p>Register with Twitter</p>
				</div>
				<div
					className={styles.item}
					onClick={() => clickHandler("reg1")}
				>
					<AiOutlineMail />
					<p>Register with E-Mail</p>
				</div>
			</div>
		</div>
	);
};

const RegistrationEmail = ({ dataHandler, clickHandler, data }) => {
	const validate = () => {
		const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!data.email) {
			toast.error("E-Mail is required");
			return;
		} else if (!emailReg.exec(data.email)) {
			toast.error("Please enter a valid e-mail");
			return;
		}
		clickHandler("reg2");
	};
	return (
		<div className={styles.modal}>
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
		</div>
	);
};

const RegistrationName = ({ dataHandler, clickHandler, data }) => {
	const validate = () => {
		if (!data.name) {
			toast.error("Name is required");
			return;
		}
		if (!data.username) {
			toast.error("Username is required");
			return;
		}
		if (data.username.length < 6) {
			toast.error("Username must be at least 6 characters");
			return;
		}
		if (data.name.length < 6) {
			toast.error("Name must be at least 6 characters");
			return;
		}
		clickHandler("reg3");
	};
	return (
		<div className={styles.modal}>
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
		</div>
	);
};

const RegistrationPassword = ({ dataHandler, clickHandler, data }) => {
	const validator = () => {
		const passRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])/;
		if (!data.password) {
			toast.error("Password is required");
			return;
		}
		if (!passRegex.exec(data.password) || data.password.length < 6) {
			toast.error("Password does not match the requried format");
			return;
		}
		if (data.password !== data.confirmation) {
			toast.error("Passwords do not match");
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
})(Landing);
