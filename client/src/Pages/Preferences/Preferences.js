import React, { useState } from "react";
import { connect } from "react-redux";
import { addPreferences } from "../../actions/user";
import { Steps } from "rsuite";
import styles from "./Preferences.module.css";
import { FaTheaterMasks, FaSuperpowers } from "react-icons/fa";
import { BsBook } from "react-icons/bs";
import { GiQuillInk } from "react-icons/gi";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { Link, useHistory } from "react-router-dom";

const genres = [
	{
		name: "Science-Fiction",
		image: "./img/astronaut.png",
	},
	{
		name: "Non-Fiction",
		image: "./img/nonfiction.png",
	},
	{
		name: "Fiction",
		image: "./img/fiction.png",
	},
	{
		name: "Thriller",
		image: "./img/thriller.png",
	},
	{
		name: "Romance",
		image: "./img/romance.png",
	},
	{
		name: "Horror",
		image: "./img/horror.png",
	},
	{
		name: "Mystery",
		image: "./img/mystery.png",
	},
	{
		name: "Children's",
		image: "./img/children.png",
	},
];

const types = [
	{
		name: "Novel",
		icon: <BsBook />,
	},
	{
		name: "Poem",
		icon: <GiQuillInk />,
	},
	{
		name: "Comic",
		icon: <FaSuperpowers />,
	},
	{
		name: "Play",
		icon: <FaTheaterMasks />,
	},
];

const loadOptions = async (input) => {
	delete axios.defaults.headers.common["x-auth-token"];
	const res = await axios.get(
		`http://openlibrary.org/search.json?author=${input}`
	);
	const data = res.data.docs.map((doc) => doc.author_name[0]);
	const uniqueData = [...new Set(data)];
	return uniqueData.map((data) => ({ label: data, value: data }));
};

const Preferences = ({ addPreferences }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [clicked, setClicked] = useState([]);
	const [clickedTypes, setClickedTypes] = useState([]);
	const [selectedAuthors, setSelectedAuthors] = useState([]);

	const submitDetails = (history, data) => {
		const { clicked, clickedTypes, selectedAuthors } = data;
		setAuthToken(localStorage.getItem("token"));
		addPreferences({
			genres: clicked,
			types: clickedTypes,
			authors: selectedAuthors,
		});
		history.push("/home");
	};

	const handleClick = (name) => {
		if (clicked.includes(name) || clickedTypes.includes(name)) {
			if (currentPage === 1) {
				const spliced = clicked.splice(clicked.indexOf(name), 1);
				const difference = clicked.filter((x) => !spliced.includes(x));
				setClicked(difference);
			} else if (currentPage === 2) {
				const spliced = clickedTypes.splice(
					clickedTypes.indexOf(name),
					1
				);
				const difference = clickedTypes.filter(
					(x) => !spliced.includes(x)
				);
				setClickedTypes(difference);
			}
		} else {
			if (currentPage === 1) {
				setClicked([...clicked, name]);
			} else if (currentPage === 2) {
				setClickedTypes([...clickedTypes, name]);
			}
		}
	};

	const validateInputs = (printErr) => {
		if (currentPage === 1) {
			// Validate page 1
			if (clicked.length < 1) {
				if (printErr) toast.error("At least one genre is required.");
				return false;
			}
			if (clicked.length > 3) {
				if (printErr)
					toast.error("No more than 3 genres can be selected.");
				return false;
			}
			return true;
		} else if (currentPage === 2) {
			// Validate page 1
			if (clickedTypes.length < 1) {
				if (printErr)
					toast.error("At least one book type is required.");
				return false;
			}
			return true;
		} else if (currentPage === 3) {
			if (selectedAuthors.length < 1) {
				if (printErr) toast.error("At least one author is required.");
				return false;
			}
			return true;
		} else if (currentPage === 4) {
			return true;
		}
	};

	const goBack = () => {
		if (currentPage < 2) return;
		setCurrentPage(currentPage - 1);
	};

	return (
		<div className={styles.container}>
			<h1>Account Creation</h1>
			<Steps
				current={currentPage}
				currentStatus={
					!validateInputs(false)
						? "error"
						: currentPage === 4
						? "finish"
						: "process"
				}
			>
				<Steps.Item title="Basic Information" />
				<Steps.Item title="Genre Preferences" />
				<Steps.Item title="Book Preferences" />
				<Steps.Item title="Top Authors" />
				<Steps.Item title="Completion" />
			</Steps>
			{currentPage === 1 && (
				<GenreSelection handleClick={handleClick} clicked={clicked} />
			)}
			{currentPage === 2 && (
				<BookTypeSelection
					handleClick={handleClick}
					clickedTypes={clickedTypes}
				/>
			)}
			{currentPage === 3 && (
				<AuthorSearch
					selectedAuthors={selectedAuthors}
					setSelectedAuthors={setSelectedAuthors}
				/>
			)}
			{currentPage === 4 && (
				<Completion
					submitDetails={submitDetails}
					clicked={clicked}
					clickedTypes={clickedTypes}
					selectedAuthors={selectedAuthors}
				/>
			)}
			{currentPage !== 4 && (
				<div className={styles.buttons}>
					<button
						onClick={() => goBack()}
						disabled={currentPage === 1}
					>
						Back
					</button>
					<button
						onClick={() =>
							validateInputs(true) &&
							setCurrentPage(currentPage + 1)
						}
					>
						Continue
					</button>
				</div>
			)}
		</div>
	);
};

const GenreSelection = ({ clicked, handleClick }) => {
	return (
		<section className={styles.genre}>
			{genres.map((genre) => (
				<div className={styles.genreFlex}>
					<div
						className={`${styles.genreContent} ${
							clicked.includes(genre.name) && styles.clicked
						}`}
						onClick={() => handleClick(genre.name)}
					>
						<div className={styles.genreTop}>
							<img src={genre.image} />
						</div>
						<div className={styles.genreBottom}>
							<p>{genre.name}</p>
						</div>
					</div>
				</div>
			))}
		</section>
	);
};

const BookTypeSelection = ({ clickedTypes, handleClick }) => {
	return (
		<>
			<h3>Search and Select Authors</h3>
			<section className={styles.genre}>
				{types.map((type) => (
					<div className={styles.genreFlex}>
						<div
							className={`${styles.genreContent} ${
								clickedTypes.includes(type.name) &&
								styles.clicked
							}`}
							onClick={() => handleClick(type.name)}
						>
							<div className={styles.genreTop}>{type.icon}</div>
							<div className={styles.genreBottom}>
								<p>{type.name}</p>
							</div>
						</div>
					</div>
				))}
			</section>
		</>
	);
};

const AuthorSearch = ({ setSelectedAuthors }) => {
	return (
		<section className={styles.select}>
			<h3>Search and Select Authors</h3>
			<AsyncSelect
				isMulti={true}
				loadOptions={loadOptions}
				onChange={(e) => {
					setSelectedAuthors(e.map((val) => val.value));
				}}
			/>
		</section>
	);
};

const Completion = ({
	clicked,
	clickedTypes,
	selectedAuthors,
	submitDetails,
}) => {
	const history = useHistory();
	return (
		<section className={styles.select}>
			<div className={styles.completed}>
				<h3>Completed</h3>
				<p>
					Thanks for filling out your details. They will help tune
					your recommendations.
				</p>
				<p>
					Click <Link to="/home">here</Link> to go to your profile.
				</p>
			</div>
			<button
				onClick={() =>
					submitDetails(history, {
						clicked,
						clickedTypes,
						selectedAuthors,
					})
				}
			>
				Finish
			</button>
		</section>
	);
};

export default connect(null, { addPreferences })(Preferences);
