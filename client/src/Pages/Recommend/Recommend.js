import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Steps } from "rsuite";
import { getSpecificRecommendations } from "../../actions/book";
import { addBookToReadingList } from "../../actions/user";
import Loading from "../../Components/Misc/Loading/Loading";
import Deck from "../../Components/Deck/Deck";
import styles from "./Recommend.module.css";
import {
	FaTheaterMasks,
	FaSuperpowers,
	FaMagic,
	FaDove,
	FaUserAstronaut,
	FaDragon,
	FaChild,
} from "react-icons/fa";
import { AiOutlineQuestion } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { BiLaugh } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import {
	GiQuillInk,
	GiRaiseZombie,
	GiAncientColumns,
	GiDramaMasks,
	GiChalkOutlineMurder,
	GiAncientRuins,
	GiPirateFlag,
	GiRayGun,
	GiMusket,
	GiFactory,
	GiRocketFlight,
	GiMicrochip,
	GiArtificialIntelligence,
	GiFilmProjector,
	GiCrimeSceneTape,
	GiLoveLetter,
	GiWhip,
} from "react-icons/gi";
import { RiGovernmentFill } from "react-icons/ri";

const Recommend = ({
	book: { loading, books },
	getSpecificRecommendations,
	addBookToReadingList,
}) => {
	const genres = [
		{
			name: "science fiction",
			display: "Science-Fiction",
			image: "./img/astronaut.png",
			icon: <FaUserAstronaut />,
		},
		{
			name: "non fiction",
			display: "Non-Fiction",
			image: "./img/nonfiction.png",
			icon: <GiFilmProjector />,
		},
		{
			name: "fiction",
			display: "Fiction",
			image: "./img/fiction.png",
			icon: <FaDragon />,
		},
		{
			name: "thriller",
			display: "Thriller",
			image: "./img/thriller.png",
			icon: <GiCrimeSceneTape />,
		},
		{
			name: "romance",
			display: "Romance",
			image: "./img/romance.png",
			icon: <GiLoveLetter />,
		},
		{
			name: "adventure",
			display: "Adventure",
			image: "./img/horror.png",
			icon: <GiWhip />,
		},
		{
			name: "mystery",
			display: "Mystery",
			image: "./img/mystery.png",
			icon: <AiOutlineQuestion />,
		},
		{
			name: "Childrens",
			display: "Children's",
			image: "./img/children.png",
			icon: <FaChild />,
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

	const eras = [
		{
			display: "Past",
			name: "past",
			icon: <GiAncientRuins />,
		},
		{
			display: "1600-1699",
			name: "1600",
			icon: <GiPirateFlag />,
		},
		{
			display: "1700-1799",
			name: "1700",
			icon: <GiMusket />,
		},
		{
			display: "1800-1899",
			name: "1800",
			icon: <GiFactory />,
		},
		{
			display: "1900-1999",
			name: "1900",
			icon: <GiRocketFlight />,
		},
		{
			display: "2000-2099",
			name: "2000",
			icon: <GiMicrochip />,
		},
		{
			display: "2100-2199",
			name: "2100",
			icon: <GiArtificialIntelligence />,
		},
		{
			display: "Future",
			name: "future",
			icon: <GiRayGun />,
		},
	];
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [selectedPreferences, setSelectedPreferences] = useState([]);
	const [selectedEras, setSelectedEras] = useState([]);
	const [limit, setLimit] = useState(0);
	const [currentSection, setCurrentSection] = useState(0);
	const [rating, setRating] = useState(0);
	const handleActionClick = () => {};

	useEffect(() => {
		if (books) {
			const bookToAdd = books[0];
			addBookToReadingList(bookToAdd?._id, rating);
			setRating(0);
		}
	}, [rating]);

	const handleClick = (name) => {
		if (
			selectedGenres.includes(name) ||
			selectedTypes.includes(name) ||
			selectedPreferences.includes(name) ||
			selectedEras.includes(name)
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
			} else if (currentSection === 3) {
				const spliced = selectedEras.splice(
					selectedEras.indexOf(name),
					1
				);
				const difference = selectedEras.filter(
					(x) => !spliced.includes(x)
				);
				setSelectedEras(difference);
			}
		} else {
			if (currentSection === 0) {
				setSelectedGenres([...selectedGenres, name]);
			} else if (currentSection === 1) {
				setSelectedTypes([...selectedTypes, name]);
			} else if (currentSection === 2) {
				setSelectedPreferences([...selectedPreferences, name]);
			} else if (currentSection === 3) {
				setSelectedEras([...selectedEras, name]);
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
			selectedEras,
			limit
		);
		setCurrentSection(currentSection + 1);
	};
	return (
		<>
			<div className={styles.container}>
				<Steps className={styles.steps} current={currentSection}>
					<Steps.Item description="Genre" />
					<Steps.Item description="Book Type" />
					<Steps.Item description="Preferences" />
					<Steps.Item description="Eras" />
					<Steps.Item description="Limit" />
					<Steps.Item description="Results" />
				</Steps>
				<div className={styles.content}>
					{currentSection === 0 && (
						<section className={styles.genre}>
							{genres.map((genre) => (
								<div
									className={styles.genreFlex}
									key={genre.name}
								>
									<div
										className={`${styles.genreContent} ${
											selectedGenres.includes(
												genre.name
											) && styles.clicked
										}`}
										onClick={() => handleClick(genre.name)}
									>
										<div className={styles.genreTop}>
											{genre.icon}
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
						<section
							className={`${styles.genre} ${styles.genreSelection}`}
						>
							{types.map((type) => (
								<div
									className={styles.genreFlex}
									key={type.name}
								>
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
										onClick={() =>
											handleClick(preference.name)
										}
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
						<section className={styles.genre}>
							{eras.map((era) => (
								<div
									className={styles.genreFlex}
									key={era.name}
								>
									<div
										className={`${styles.genreContent} ${
											selectedEras.includes(era.name) &&
											styles.clicked
										}`}
										onClick={() => handleClick(era.name)}
									>
										<div className={styles.genreTop}>
											{era.icon}
										</div>
										<div className={styles.genreBottom}>
											<p>{era.display}</p>
										</div>
									</div>
								</div>
							))}
						</section>
					)}
					{currentSection === 4 && (
						<section className={`${styles.genre} ${styles.col}`}>
							<h3>Limiting</h3>
							<p>How many results should we return?</p>
							<input
								type="number"
								onChange={(e) => setLimit(+e.target.value)}
							/>
						</section>
					)}
					{currentSection === 5 && (
						<>
							<h3>Your Results</h3>
							{loading ? (
								<Loading />
							) : books.length === 0 ? (
								<div className={styles.noBooks}>
									<p>No more books remaining!</p>
									<p>
										Click <Link to={`/list`}>here</Link> to
										view your reading list.
									</p>
								</div>
							) : (
								<div className={styles.cardsParentContainer}>
									<div className={styles.cardsContainer}>
										<Deck
											loading={loading}
											choiceEvent={handleActionClick}
											books={[...books].reverse()}
											translate={true}
											choiceEvent={setRating}
										/>
									</div>
									<div className={styles.mainContent}>
										<div className={styles.actions}>
											<button>
												<ImCross
													onClick={() =>
														setRating(-1)
													}
												/>
											</button>
											<button>
												<FaHeart
													onClick={() => setRating(1)}
												/>
											</button>
										</div>
									</div>
								</div>
							)}
						</>
					)}
					{currentSection < 5 && (
						<div className={styles.buttons}>
							<button
								onClick={() => goBack()}
								disabled={currentSection === 0}
							>
								Back
							</button>
							<button
								onClick={() =>
									validateInputs(true) && currentSection === 4
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
		</>
	);
};

const mapStateToProps = (state) => ({
	book: state.book,
});

export default connect(mapStateToProps, {
	getSpecificRecommendations,
	addBookToReadingList,
})(Recommend);
