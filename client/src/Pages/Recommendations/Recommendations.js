import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecommendations } from "../../actions/book";
import styles from "./Recommendations.module.css";

const Recommendations = ({ getRecommendations, books }) => {
	useEffect(() => {
		getRecommendations(100, 0);
	}, []);

	if (!books) {
		return <p>Loading...</p>;
	}
	return (
		<>
			<div className={styles.books}>
				{books.map((book) => (
					<div className={styles.book}>
						<div className={styles.bookInner}>
							<div className={styles.imageContainer}>
								<img
									src={`http://covers.openlibrary.org/b/olid/${book.olId}-M.jpg`}
								/>
							</div>
							<div className={styles.bookDetails}>
								<h4>{book.title}</h4>
								<h4>{book.authors[0]}</h4>
								<h5>
									{Math.round(book.certainty * 100000) / 1000}
									%
								</h5>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	books: state.book.books,
});

export default connect(mapStateToProps, { getRecommendations })(
	Recommendations
);
