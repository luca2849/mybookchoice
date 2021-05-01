import React, { useState } from "react";
import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { searchUsers } from "../../actions/data";
import List from "../../Components/List/List";

const Search = ({ data: { searchResults, loading }, searchUsers }) => {
	const [isFocused, setIsFocused] = useState(false);
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={`${isFocused && styles.focused} ${styles.top}`}>
					<h3>User Search</h3>
					<input
						type="text"
						placeholder="Search..."
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						onChange={(e) => searchUsers(e.target.value)}
					/>
				</div>
				{!loading && (
					<List>
						{searchResults.map((item) => (
							<List.Item cssClass={styles.item}>
								<Link to={`/user/${item.username}`}>
									<div className={styles.imageContainer}>
										<img
											src={
												item.profileImage.imageType ===
												"EXTERNAL"
													? item.profileImage.url
													: `${process.env.REACT_APP_SERVER_URL}/api/img/${item.profileImage.url}`
											}
										/>
									</div>
									{item.name} ({item.username})
								</Link>
							</List.Item>
						))}
					</List>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	data: state.data,
});

export default connect(mapStateToProps, { searchUsers })(Search);
