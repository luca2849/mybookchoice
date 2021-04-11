import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Steps } from "rsuite";
import { Table } from "rsuite";
import { getSpecificRecommendations } from "../../actions/book";
import Loading from "../../Components/Misc/Loading/Loading";
import styles from "./Recommend.module.css";
import { FaTheaterMasks, FaSuperpowers, FaMagic, FaDove } from "react-icons/fa";
import { BsBook } from "react-icons/bs";
import { BiLaugh } from "react-icons/bi";
import {
	GiQuillInk,
	GiRaiseZombie,
	GiAncientColumns,
	GiDramaMasks,
	GiChalkOutlineMurder,
} from "react-icons/gi";
import { RiGovernmentFill } from "react-icons/ri";

const { Column, HeaderCell, Cell, Pagination } = Table;

const Recommend = ({
	book: { loading, books },
	getSpecificRecommendations,
}) => {
	const genres = [
		{
			name: "science fiction",
			display: "Science-Fiction",
			image: "./img/astronaut.png",
		},
		{
			name: "non fiction",
			display: "Non-Fiction",
			image: "./img/nonfiction.png",
		},
		{
			name: "fiction",
			display: "Fiction",
			image: "./img/fiction.png",
		},
		{
			name: "thriller",
			display: "Thriller",
			image: "./img/thriller.png",
		},
		{
			name: "romance",
			display: "Romance",
			image: "./img/romance.png",
		},
		{
			name: "adventure",
			display: "Adventure",
			image: "./img/horror.png",
		},
		{
			name: "mystery",
			display: "Mystery",
			image: "./img/mystery.png",
		},
		{
			name: "Childrens",
			display: "Children's",
			image: "./img/children.png",
		},
	];

	const types = [
		{
			name: "book",
			display: "Novel",
			icon: <BsBook />,
		},
		{
			name: "poetry",
			display: "Poem",
			icon: <GiQuillInk />,
		},
		{
			name: "comic",
			display: "Comic",
			icon: <FaSuperpowers />,
		},
		{
			name: "play",
			display: "Play",
			icon: <FaTheaterMasks />,
		},
	];

	const preferences = [
		{
			name: "humour",
			display: "Comedy",
			icon: <BiLaugh />,
		},
		{
			name: "horror",
			display: "Horror",
			icon: <GiRaiseZombie />,
		},
		{
			name: "magic",
			display: "Magic",
			icon: <FaMagic />,
		},
		{
			name: "classics",
			display: "Classics",
			icon: <GiAncientColumns />,
		},
		{
			name: "hope",
			display: "Hope",
			icon: <FaDove />,
		},
		{
			name: "political",
			display: "Politics",
			icon: <RiGovernmentFill />,
		},
		{
			name: "drama",
			display: "Drama",
			icon: <GiDramaMasks />,
		},
		{
			name: "suspense",
			display: "Suspense",
			icon: <GiChalkOutlineMurder />,
		},
	];
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedPreferences, setSelectedPreferences] = useState([]);
	const [limit, setLimit] = useState(0);
	const [currentSection, setCurrentSection] = useState(0);
	const handleClick = (name) => {
		if (
			selectedGenres.includes(name) ||
			selectedTypes.includes(name) ||
			selectedPreferences.includes(name)
		) {
			if (currentSection === 0) {
				const spliced = selectedGenres.splice(
					selectedGenres.indexOf(name),
					1
				);
				const difference = selectedGenres.filter(
					(x) => !spliced.includes(x)
				);
				setSelectedGenres(difference);
			} else if (currentSection === 1) {
				const spliced = selectedTypes.splice(
					selectedTypes.indexOf(name),
					1
				);
				const difference = selectedTypes.filter(
					(x) => !spliced.includes(x)
				);
				setSelectedTypes(difference);
			} else if (currentSection === 2) {
				const spliced = selectedPreferences.splice(
					selectedPreferences.indexOf(name),
					1
				);
				const difference = selectedPreferences.filter(
					(x) => !spliced.includes(x)
				);
				setSelectedPreferences(difference);
			}
		} else {
			if (currentSection === 0) {
				setSelectedGenres([...selectedGenres, name]);
			} else if (currentSection === 1) {
				setSelectedTypes([...selectedTypes, name]);
			} else if (currentSection === 2) {
				setSelectedPreferences([...selectedPreferences, name]);
			}
		}
	};
	const goBack = () => {
		if (currentSection < 1) return;
		setCurrentSection(currentSection - 1);
	};
	const validateInputs = () => {
		return true;
	};
	const getResults = () => {
		getSpecificRecommendations(
			selectedGenres,
			selectedTypes,
			selectedPreferences,
			limit
		);
		setCurrentSection(currentSection + 1);
	};
	console.log(selectedPreferences);
	return (
		<div className={styles.container}>
			<Steps className={styles.steps} current={currentSection}>
				<Steps.Item description="Genre" />
				<Steps.Item description="Book Type" />
				<Steps.Item description="Preferences" />
				<Steps.Item description="Limit" />
				<Steps.Item description="Results" />
			</Steps>
			<div className={styles.content}>
				{currentSection === 0 && (
					<section className={styles.genre}>
						{genres.map((genre) => (
							<div className={styles.genreFlex} key={genre.name}>
								<div
									className={`${styles.genreContent} ${
										selectedGenres.includes(genre.name) &&
										styles.clicked
									}`}
									onClick={() => handleClick(genre.name)}
								>
									<div className={styles.genreTop}>
										<img src={genre.image} />
									</div>
									<div className={styles.genreBottom}>
										<p>{genre.display}</p>
									</div>
								</div>
							</div>
						))}
					</section>
				)}
				{currentSection === 1 && (
					<section className={styles.genre}>
						{types.map((type) => (
							<div className={styles.genreFlex}>
								<div
									className={`${styles.genreContent} ${
										selectedTypes.includes(type.name) &&
										styles.clicked
									}`}
									onClick={() => handleClick(type.name)}
								>
									<div className={styles.genreTop}>
										{type.icon}
									</div>
									<div className={styles.genreBottom}>
										<p>{type.display}</p>
									</div>
								</div>
							</div>
						))}
					</section>
				)}
				{currentSection === 2 && (
					<section className={styles.genre}>
						{preferences.map((preference) => (
							<div
								className={styles.genreFlex}
								key={preference.name}
							>
								<div
									className={`${styles.genreContent} ${
										selectedPreferences.includes(
											preference.name
										) && styles.clicked
									}`}
									onClick={() => handleClick(preference.name)}
								>
									<div className={styles.genreTop}>
										{preference.icon}
									</div>
									<div className={styles.genreBottom}>
										<p>{preference.display}</p>
									</div>
								</div>
							</div>
						))}
					</section>
				)}
				{currentSection === 3 && (
					<section className={`${styles.genre} ${styles.col}`}>
						<h3>Limiting</h3>
						<p>How many results should we return?</p>
						<input
							type="number"
							onChange={(e) => setLimit(+e.target.value)}
						/>
					</section>
				)}
				{currentSection === 4 && (
					<>
						<h3>Your Results</h3>
						{loading ? (
							<Loading />
						) : (
							<div className={styles.tableContainer}>
								<Table
									data={books}
									height={
										books.length > 5
											? 500
											: books.length * 100
									}
								>
									<Column
										width={100}
										align="center"
										flexGrow={true}
									>
										<HeaderCell>Title</HeaderCell>
										<Cell dataKey="title" />
									</Column>
									<Column align="center">
										<HeaderCell>OpenLibrary ID</HeaderCell>
										<Cell dataKey="olId" />
									</Column>
									<Column align="center" flexGrow={true}>
										<HeaderCell>Author(s)</HeaderCell>
										<ListCell dataKey="authors" />
									</Column>
									<Column align="center">
										<HeaderCell>Accuracy</HeaderCell>
										<ScoreCell dataKey="score" />
									</Column>
									<Column align="center">
										<HeaderCell></HeaderCell>
										<ActionCell dataKey="olId" />
									</Column>
								</Table>
							</div>
						)}
					</>
				)}
				{currentSection < 4 && (
					<div className={styles.buttons}>
						<button
							onClick={() => goBack()}
							disabled={currentSection === 0}
						>
							Back
						</button>
						<button
							onClick={() =>
								validateInputs(true) && currentSection === 3
									? getResults()
									: setCurrentSection(currentSection + 1)
							}
						>
							Continue
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

const ActionCell = ({ rowData, dataKey, ...props }) => {
	return (
		<Cell {...props} className="link-group">
			<a
				target="_blank"
				href={`https://openlibrary.org/works/${rowData[dataKey]}`}
				className={styles.moreInfo}
			>
				More Info
			</a>
		</Cell>
	);
};

const ListCell = ({ rowData, dataKey, ...props }) => {
	const cleanData = rowData[dataKey].join(", ");
	return (
		<Cell {...props} className="link-group">
			{cleanData}
		</Cell>
	);
};

const ScoreCell = ({ rowData, dataKey, ...props }) => {
	const score = rowData[dataKey].split("%")[0];
	console.log(score);
	return (
		<Cell
			{...props}
			className={`link-group ${
				score > 75
					? styles.green
					: score > 50
					? styles.orange
					: styles.red
			}`}
		>
			{rowData[dataKey]}
		</Cell>
	);
};

const mapStateToProps = (state) => ({
	book: state.book,
});

export default connect(mapStateToProps, { getSpecificRecommendations })(
	Recommend
);
