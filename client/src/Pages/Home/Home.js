import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./Home.module.css";
import axios from "axios";

import setAuthToken from "../../utils/setAuthToken";
import { addRating } from "../../actions/user";
import { useSpring, animated } from "react-spring";

import { AiOutlineClose } from "react-icons/ai";
import { CgLoadbar } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";
import { HiOutlineArrowLeft } from "react-icons/hi";

import Deck from "../../Components/Deck/Deck";

const Home = ({ user, addRating }) => {
	const [books, setBooks] = useState([]);

	useEffect(async () => {
		// Gather Books
		setAuthToken(localStorage.getItem("token"));
		const res = await axios.get("/api/user/books");
		// Request details from OL
		const isbnList = res.data.map((isbn) => `${isbn.isbn}`).join(",");
		delete axios.defaults.headers.common["x-auth-token"];
		const resOpenLibrary = await axios.get(
			`https://openlibrary.org/api/books?bibkeys=${isbnList}&jscmd=data&format=json`
		);
		const booksArray = Object.values(resOpenLibrary.data);
		const bookData = [];
		console.log(booksArray);
		for (let i = 0; i < booksArray.length - 1; i++) {
			const book = booksArray[i];
			const newBook = {
				isbn: res.data[i].isbn,
				olId: book.key.split("/")[2],
				pageCount: book.number_of_pages,
				title: book.title,
				covers: {
					large: book.cover.large,
					medium: book.cover.medium,
					small: book.cover.small,
				},
				authors: book.authors.map((auth) => auth.name),
				published: {
					by: book.publishers.map((pub) => pub.name),
					year: book.publish_date
						.split("-")
						.map((item) => (item.length === 4 ? item : null))
						.pop(),
				},
				bookPlaces:
					book.subject_places &&
					book.subject_places.map((place) => place.name),
				bookPeople:
					book.subject_people &&
					book.subject_people.map((person) => person.name),
				subjects: book.subjects.map((sub) => sub.name),
			};
			bookData.push(newBook);
		}
		setBooks(bookData);
	}, []);

	const handleClick = async (rating) => {
		console.log(books[0]);
		setAuthToken(localStorage.getItem("token"));
		addRating(books[0], rating);
		setBooks(books.slice(1));
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					<Deck books={books} />
				</div>
				<div className={styles.mainContent}>
					<div className={styles.actions}>
						<button>
							<HiOutlineArrowLeft onClick={() => handleClick()} />
						</button>
						<button>
							<CgLoadbar onClick={() => handleClick(0)} />
						</button>
						<button>
							<AiOutlineClose onClick={() => handleClick(-1)} />
						</button>
						<button>
							<FaHeart onClick={() => handleClick(1)} />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

export default connect(mapStateToProps, { addRating })(Home);
