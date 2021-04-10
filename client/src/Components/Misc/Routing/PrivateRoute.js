import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MainNavigation from "../../Navigation/MainNavigation/MainNavigation";
import Loading from "../Loading/Loading";

const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, loading },
	...rest
}) => (
	<Route
		{...rest}
		render={(props) =>
			loading ? (
				<Loading />
			) : isAuthenticated ? (
				<MainNavigation>
					<Component {...props} />
				</MainNavigation>
			) : (
				<Redirect to="/" />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
