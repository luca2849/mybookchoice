import React from "react";
import styles from "./Book.module.css";
import { BsInfoCircleFill } from "react-icons/bs";

const Book = ({ book }) => {
	console.log(book);
	if (!book) return <p>Loading...</p>;
	return (
		<div
			className={styles.bookContainer}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${book.covers.medium})`,
			}}
		>
			<div className={styles.book}>
				<h2>{book.title}</h2>
				<p>{book.authors[0]}</p>
				<p>{book.published.year}</p>
				<BsInfoCircleFill className={styles.icon} />
			</div>
		</div>
	);
};

export default Book;
