import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./MainNavigation.module.css";

// Icons
import { BsFillPersonFill } from "react-icons/bs";
import { AiFillBell, AiOutlineSearch } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu, GiMagnifyingGlass } from "react-icons/gi";

import Logo from "../../Misc/Logo/Logo";
import SocketNotifications from "../../SocketNotifications/SocketNotifications";

const MainNavigation = ({ children, user }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<div className="box">
			<SocketNotifications user={user} />
			<nav className={styles.mainNav}>
				<div className={styles.brand}>
					<Logo fill={"rgb(16, 167, 209)"} height={40} width={40} />
					<h1>
						<Link to="/home">MyBookChoice</Link>
					</h1>
				</div>
				<div className={styles.mobileBrand}>
					<h1>
						<Link to="/home">
							{" "}
							<Logo
								fill={"rgb(16, 167, 209)"}
								height={40}
								width={40}
							/>
						</Link>
					</h1>
				</div>
				<div className={styles.navigation}>
					<Link to="/profile">
						<button className={styles.user}>
							<BsFillPersonFill />
							{user && user.username}
						</button>
					</Link>
				</div>
				<div className={styles.mobileNavigationButton}>
					<button
						className={styles.menuButton}
						onClick={() => setMenuOpen(!menuOpen)}
					>
						<GiHamburgerMenu />
					</button>
				</div>
				<div
					className={`${styles.mobileMenu} ${
						menuOpen ? styles.open : ""
					}`}
				>
					<div className={styles.top}>
						<div className={styles.logoContainer}>
							<Logo
								fill={"rgb(16, 167, 209)"}
								height={40}
								width={40}
							/>
						</div>
						<div
							className={styles.closeButton}
							onClick={() => setMenuOpen(false)}
						>
							<GrClose onClick={() => setMenuOpen(false)} />
						</div>
					</div>

					<div className={styles.mobileMenuItems}>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/search"
							>
								<AiOutlineSearch />
								User Search
							</Link>
						</div>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/profile"
							>
								<BsFillPersonFill />
								My Profile
							</Link>
						</div>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/recommend"
							>
								<GiMagnifyingGlass />
								Specific Recommendation
							</Link>
						</div>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/notifications"
							>
								<AiFillBell />
								My Notifications
							</Link>
						</div>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/friends"
							>
								<FaUserFriends />
								My Friends
							</Link>
						</div>
						<div className={styles.item}>
							<Link
								onClick={() => setMenuOpen(false)}
								to="/messages"
							>
								<RiMessage2Line />
								My Messages
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<div
				style={{ height: "100%" }}
				className={menuOpen ? styles.fixed : "main"}
			>
				{children}
			</div>
		</div>
	);
};

MainNavigation.propTypes = {
	user: PropTypes.object,
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, null)(MainNavigation);
