import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MainNavigation from "../../Navigation/MainNavigation/MainNavigation";

const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, user },
	...rest
}) => (
	<Route
		{...rest}
		render={(props) =>
			!isAuthenticated ? (
				<Redirect to="/" />
			) : (
				<MainNavigation>
					<Component {...props} />
				</MainNavigation>
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
