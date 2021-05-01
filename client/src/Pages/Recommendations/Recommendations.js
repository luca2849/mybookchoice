import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getRecommendations } from "../../actions/book";
import Loading from "../../Components/Misc/Loading/Loading";
import styles from "./Recommendations.module.css";

const Recommendations = ({ getRecommendations, book: { books, loading } }) => {
	useEffect(() => {
		getRecommendations(100, 0);
	}, [getRecommendations]);

	if (loading || !books) {
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
							rel="noreferrer"
						>
							<div className={styles.bookInner}>
								<div className={styles.imageContainer}>
									<img
										alt="Book Cover"
										src={`http://covers.openlibrary.org/b/olid/${book.olId}-M.jpg`}
									/>
								</div>
								<div className={styles.bookDetails}>
									<h4>{book.title}</h4>
									<h5>
										{book.authors.map((auth) => (
											<span>{auth} </span>
										))}
									</h5>
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
