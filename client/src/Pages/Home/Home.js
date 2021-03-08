import React from "react";
import { connect } from "react-redux";
import styles from "./Home.module.css";

const Home = ({ user }) => {
	return (
		<div className={styles.container}>
			<p>Home Page</p>
			{user.ratings.length >= 10 ? <p>Good</p> : <p>Bad</p>}
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, null)(Home);
