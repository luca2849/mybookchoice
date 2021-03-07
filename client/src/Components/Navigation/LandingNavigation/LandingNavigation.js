import React from "react";
import styles from "./LandingNavigation.module.css";

import Logo from "../../Misc/Logo/Logo";

const LandingNavigation = ({ children }) => {
	return (
		<div className={styles.container}>
			<nav className={styles.nav}>
				<div className={styles.navLeft}>
					<Logo fill={"rgb(16, 167, 209)"} />
					<h2>MyBookChoice</h2>
				</div>
			</nav>
			<div className={styles.content}>{children}</div>
		</div>
	);
};

export default LandingNavigation;
