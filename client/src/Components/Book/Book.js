import React from "react";
import styles from "./Book.module.css";

const Book = ({ book, height, link, cssClass }) => {
	if (!book) return <p>Loading...</p>;
	// Trucate Title
	let title = book.title;
	if (title.length > 30) title = book.title.substring(0, 30).concat("...");
	let colourClass = styles.green;
	if (book.score) {
		if (+book.score.split("%")[0] < 75) {
			colourClass = styles.orange;
		} else if (+book.score.split("%")[0] < 50) {
			colourClass = styles.red;
		}
	}
	const openBookPage = (url) => {
		const win = window.open(url, "_blank");
		win.focus();
	};
	return (
		<div
			className={`${cssClass} ${styles.bookContainer}`}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(http://covers.openlibrary.org/b/olid/${book.olId}-M.jpg)`,
				backgroundSize: "cover",
				height: height,
			}}
			onClick={() => {
				if (link) {
					openBookPage(`https://openlibrary.org/works/${book.olId}`);
				}
			}}
		>
			{" "}
			<div className={styles.book}>
				{book.score && (
					<div className={`${styles.score} ${colourClass}`}>
						<p>{book.score}</p>
					</div>
				)}
				<div className={styles.lower}>
					<h2>{title}</h2>
					<p>{book.authors ? book.authors[0] : null}</p>
					<p>{book.published ? book.published.year : null}</p>
				</div>
			</div>
		</div>
	);
};

export default Book;
