import React from "react";
import { Link } from "react-router-dom";

import styles from "./Home.module.css";

import { BsFillPersonFill } from "react-icons/bs";
import { AiFillBell, AiOutlineSearch } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";
import { GiMagnifyingGlass } from "react-icons/gi";

const Home = () => {
	return (
		<div className={styles.container}>
			<h3>
				Welcome to <span>MyBookChoice</span>
			</h3>
			<div className={styles.navigation}>
				<div className={styles.item}>
					<Link to="/recommend">
						<GiMagnifyingGlass />
						Specific Recommendation
					</Link>
				</div>
				<div className={styles.item}>
					<Link to="/profile">
						<BsFillPersonFill />
						My Profile
					</Link>
				</div>
				<div className={styles.item}>
					<Link to="/search">
						<AiOutlineSearch />
						User Search
					</Link>
				</div>
				<div className={styles.item}>
					<Link to="/notifications">
						<AiFillBell />
						My Notifications
					</Link>
				</div>
				<div className={styles.item}>
					<Link to="/friends">
						<FaUserFriends />
						My Friends
					</Link>
				</div>
				<div className={styles.item}>
					<Link to="/messages">
						<RiMessage2Line />
						My Messages
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
