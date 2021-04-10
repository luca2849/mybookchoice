import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Steps } from "rsuite";
import { getSpecificRecommendations } from "../../actions/book";
import Loading from "../../Components/Misc/Loading/Loading";
import styles from "./Recommend.module.css";
import { FaTheaterMasks, FaSuperpowers } from "react-icons/fa";
import { BsBook } from "react-icons/bs";
import { GiQuillInk } from "react-icons/gi";

const Recommend = ({
	book: { loading, books },
	getSpecificRecommendations,
}) => {
	// useEffect(() => {
	// 	getSpecificRecommendations(["fiction"], ["poetry"], 5);
	// }, []);

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
			name: "horror",
			display: "Horror",
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
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedTypes, setSelectedTypes] = useState([]);
	const [limit, setLimit] = useState(0);
	const [currentSection, setCurrentSection] = useState(0);
	// if (!books || books.length === 0) return <Loading />;
	const handleClick = (name) => {
		if (selectedGenres.includes(name) || selectedTypes.includes(name)) {
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
			}
		} else {
			if (currentSection === 0) {
				setSelectedGenres([...selectedGenres, name]);
			} else if (currentSection === 1) {
				setSelectedTypes([...selectedTypes, name]);
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
		console.log("clicked");
		getSpecificRecommendations(selectedGenres, selectedTypes, limit);
		setCurrentSection(currentSection + 1);
	};
	return (
		<div className={styles.container}>
			<Steps current={currentSection} vertical={true}>
				<Steps.Item title="Genre Selection" />
				<Steps.Item title="Book Type Selection" />
				<Steps.Item title="Feature #3 Selection" />
				<Steps.Item title="Limiting Results" />
				<Steps.Item title="Your Results" />
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
						<h3>Third Feature</h3>
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
					<section>
						<h3>Your Results</h3>
						{loading ? (
							<Loading />
						) : (
							<div className={styles.books}>
								{books.map((book) => (
									<div className={styles.book} key={book._id}>
										<a
											href={`https://openlibrary.org/works/${book.olId}`}
											target="_blank"
										>
											<div className={styles.bookInner}>
												<div
													className={
														styles.imageContainer
													}
												>
													<img
														src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
													/>
												</div>
												<div
													className={
														styles.bookDetails
													}
												>
													<h4>{book.title}</h4>
													<h5>
														{book.authors.map(
															(auth) => (
																<span>
																	{auth}{" "}
																</span>
															)
														)}
													</h5>
												</div>
											</div>
										</a>
									</div>
								))}
							</div>
						)}
					</section>
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

const mapStateToProps = (state) => ({
	book: state.book,
});

export default connect(mapStateToProps, { getSpecificRecommendations })(
	Recommend
);
