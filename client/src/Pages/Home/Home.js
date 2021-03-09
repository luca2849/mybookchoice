import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./Home.module.css";

import { useSpring, animated } from "react-spring";

import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { CgLoadbar } from "react-icons/cg";
import { HiOutlineArrowLeft } from "react-icons/hi";

import Deck from "../../Components/Deck/Deck";

const Home = ({ user }) => {
	const [books, setBooks] = useState([
		{
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
			published: "1970",
			image: "https://covers.openlibrary.org/b/id/6498519-M.jpg",
		},
		{
			title: "Great Expectations",
			author: "Charles Dickens",
			published: "1861",
			image: "https://covers.openlibrary.org/b/id/6795038-M.jpg",
		},
		{
			title: "James and the Giant Peach",
			author: "Roald Dahl",
			published: "1961",
			image: "https://covers.openlibrary.org/b/id/10601593-M.jpg",
		},
	]);

	const handleClick = () => {
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
							<CgLoadbar onClick={() => handleClick()} />
						</button>
						<button>
							<AiOutlineClose onClick={() => handleClick()} />
						</button>
						<button>
							<AiOutlineCheck onClick={() => handleClick()} />
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

export default connect(mapStateToProps, null)(Home);
