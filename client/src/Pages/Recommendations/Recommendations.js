import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRecommendations } from "../../actions/book";
import styles from "./Recommendations.module.css";

const Recommendations = ({ getRecommendations, books }) => {
	const [page, setPage] = useState(0);
	useEffect(() => {
		getRecommendations(20, 0);
	}, []);

	useEffect(() => {
		getRecommendations(8, page * 8);
	}, [page]);

	if (!books) {
		return <p>Loading...</p>;
	}
	return (
		<>
			<div className={styles.pagination}>
				<button onClick={() => setPage(0)}>0</button>
				<button onClick={() => setPage(1)}>1</button>
				<button onClick={() => setPage(2)}>2</button>
				<button onClick={() => setPage(3)}>3</button>
			</div>
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
