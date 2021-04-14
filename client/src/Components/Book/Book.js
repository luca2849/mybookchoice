import React from "react";
import styles from "./Book.module.css";
import { BsInfoCircleFill } from "react-icons/bs";

const Book = ({ book }) => {
	if (!book) return <p>Loading...</p>;
	console.log(book);
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
	return (
		<div
			className={styles.bookContainer}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(http://covers.openlibrary.org/b/olid/${book.olId}-M.jpg)`,
			}}
		>
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
					<BsInfoCircleFill className={styles.icon} />
				</div>
			</div>
		</div>
	);
};

export default Book;
