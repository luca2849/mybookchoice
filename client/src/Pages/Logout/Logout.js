import React from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { Redirect } from "react-router-dom";

const Logout = ({ logout }) => {
	logout();
	return <Redirect to="/" />;
};

export default connect(null, { logout })(Logout);
