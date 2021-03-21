import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styles from "./Home.module.css";
import axios from "axios";

import setAuthToken from "../../utils/setAuthToken";
import { addRating } from "../../actions/user";

import { FaHeart, FaQuestion } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ImCross } from "react-icons/im";

import Deck from "../../Components/Deck/Deck";
import Loading from "../../Components/Misc/Loading/Loading";

const Home = ({ addRating }) => {
	const [books, setBooks] = useState([]);

	const getBooks = async (count, skip) => {
		// Gather Books
		try {
			setAuthToken(localStorage.getItem("token"));
			const res = await axios.get(
				`/api/user/books?bookCount=${count}&skip=${skip}`
			);
			// Request details from OL
			const isbnList = res.data.map((isbn) => `${isbn.isbn}`).join(",");
			delete axios.defaults.headers.common["x-auth-token"];
			const resOpenLibrary = await axios.get(
				`https://openlibrary.org/api/books?bibkeys=${isbnList}&jscmd=data&format=json`
			);
			const booksArray = Object.values(resOpenLibrary.data);
			const bookData = [];
			for (let i = 0; i < booksArray.length; i++) {
				const book = booksArray[i];
				const newBook = {
					isbn: res.data[i].isbn,
					olId: book.key.split("/")[2],
					pageCount: book.number_of_pages,
					title: book.title,
					covers: {
						large: book.cover ? book.cover.large : null,
						medium: book.cover ? book.cover.medium : null,
						small: book.cover ? book.cover.small : null,
					},
					authors:
						book.authors && book.authors.map((auth) => auth.name),
					published: {
						by:
							book.publishers &&
							book.publishers.map((pub) => pub.name),
						year:
							book.publish_date &&
							book.publish_date
								.split("-")
								.map((item) =>
									item.length === 4 ? item : null
								)
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
			return bookData;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(async () => {
		const bookData = await getBooks(10, 0);
		setBooks(bookData);
	}, []);

	const handleClick = async (rating) => {
		setAuthToken(localStorage.getItem("token"));
		await addRating(books[0], rating);
		const bookData = await getBooks(1, 9);
		let tmp = books.concat(bookData);
		setBooks(tmp.slice(1));
	};

	if (!books) console.log("No Books...");

	return (
		<>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					{books.length === 0 ? <Loading /> : <Deck books={books} />}
				</div>
				<div className={styles.mainContent}>
					<div className={styles.actions}>
						<button>
							<IoMdArrowRoundBack onClick={() => handleClick()} />
						</button>
						<button>
							<FaQuestion onClick={() => handleClick(0)} />
						</button>
						<button>
							<ImCross onClick={() => handleClick(-1)} />
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

// const mapStateToProps = (state) => ({
// 	user: state.auth.user,
// });

export default connect(null, { addRating })(Home);
