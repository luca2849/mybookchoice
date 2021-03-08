import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./MainNavigation.module.css";

// Icons
import { BsFillPersonFill } from "react-icons/bs";

import Logo from "../../Misc/Logo/Logo";

const MainNavigation = ({ children, user }) => {
	return (
		<>
			<nav className={styles.mainNav}>
				<div className={styles.brand}>
					<Logo fill={"rgb(16, 167, 209)"} height={40} width={40} />
					<h1>
						<Link to="/home">MyBookChoice</Link>
					</h1>
				</div>
				<div className={styles.navigation}>
					<Link to="/profile">
						<button className={styles.user}>
							<BsFillPersonFill />
							{user.username}
						</button>
					</Link>
				</div>
			</nav>

			{children}
		</>
	);
};

MainNavigation.propTypes = {
	user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, null)(MainNavigation);
