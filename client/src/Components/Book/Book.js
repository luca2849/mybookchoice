import React from "react";
import styles from "./Book.module.css";
import { BsInfoCircleFill } from "react-icons/bs";

const Book = ({ book }) => {
	return (
		<div
			className={styles.bookContainer}
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${book.image})`,
			}}
		>
			<div className={styles.book}>
				<h2>{book.title}</h2>
				<p>{book.author}</p>
				<p>{book.published}</p>
				<BsInfoCircleFill className={styles.icon} />
			</div>
		</div>
	);
};

export default Book;
