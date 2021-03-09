import React from "react";
import Deck from "../../Components/Deck/Deck";
import styles from "./Profile.module.css";

import { animated } from "react-spring";

const Profile = () => {
	return (
		<animated.div className={styles.root}>
			<Deck />
		</animated.div>
	);
};

export default Profile;
