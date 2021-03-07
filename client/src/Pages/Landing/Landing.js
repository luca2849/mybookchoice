import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../..//actions/auth";

const Landing = ({ login }) => {
	const [loginData, setLoginData] = useState({});

	const handleLoginDataChange = (e) => {
		setLoginData({ ...loginData, [e.target.name]: e.target.value });
	};

	const handleLoginSubmit = () => {
		login(loginData);
	};

	return (
		<div>
			<input
				type="text"
				name="email"
				// value={loginData.email || ""}
				onChange={(e) => handleLoginDataChange(e)}
			/>
			<input
				type="password"
				name="password"
				// value={loginData.password || ""}
				onChange={(e) => handleLoginDataChange(e)}
			/>
			<button onClick={() => handleLoginSubmit()}>Login</button>
		</div>
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
