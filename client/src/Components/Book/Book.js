import React from "react";
import styles from "./Book.module.css";
import { BsInfoCircleFill } from "react-icons/bs";

const Book = ({ book }) => {
	if (!book) return <p>Loading...</p>;
	return (
		<div
			className={styles.bookContainer}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${
					book.covers
						? book.covers.medium === null
							? "img/imagemissing.webp"
							: book.covers.medium
						: "img/imagemissing.webp"
				})`,
			}}
		>
			<div className={styles.book}>
				<h2>{book.title}</h2>
				<p>{book.authors ? book.authors[0] : null}</p>
				<p>{book.published ? book.published.year : null}</p>
				<BsInfoCircleFill className={styles.icon} />
			</div>
		</div>
	);
};

export default Book;
