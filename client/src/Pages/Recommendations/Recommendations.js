import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecommendations } from "../../actions/book";
import Loading from "../../Components/Misc/Loading/Loading";
import styles from "./Recommendations.module.css";

const Recommendations = ({ getRecommendations, book: { books, loading } }) => {
	useEffect(() => {
		getRecommendations(100, 0);
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<>
			<h2>Your Recommendations</h2>
			<div className={styles.books}>
				{books.map((book) => (
					<div className={styles.book}>
						<a
							href={`https://openlibrary.org/works/${book.olId}`}
							target="_blank"
						>
							<div className={styles.bookInner}>
								<div className={styles.imageContainer}>
									<img
										src={`http://covers.openlibrary.org/b/olid/${book.olId}-M.jpg`}
									/>
								</div>
								<div className={styles.bookDetails}>
									<h4>{book.title}</h4>
									<h5>{book.authors[0]}</h5>
								</div>
							</div>
						</a>
					</div>
				))}
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	book: state.book,
});

export default connect(mapStateToProps, { getRecommendations })(
	Recommendations
);
