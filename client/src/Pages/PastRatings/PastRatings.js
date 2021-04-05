import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import styles from "./PastRatings.module.css";

import { getRatings, updateRating, addToRatings } from "../../actions/user";

import { FaHeart, FaQuestion } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { ImCross } from "react-icons/im";

import InfiniteScroll from "react-infinite-scroller";
import Loading from "../../Components/Misc/Loading/Loading";
import List from "../../Components/List/List";
import BreadCrumb from "../../Components/BreadCrumb/BreadCrumb";

const PastRatings = ({
	userState: { loading, ratings },
	getRatings,
	updateRating,
	addToRatings,
}) => {
	const [limit, setLimit] = useState(20);
	const [skip, setSkip] = useState(0);
	const [done, setDone] = useState(true);
	const [selectedRating, setSelectedRating] = useState(null);
	const [newRating, setNewRating] = useState(null);

	useEffect(() => {
		getRatings(limit, skip);
	}, []);

	if (loading) return <Loading />;

	const handleUpdate = () => {
		updateRating(selectedRating._id, newRating);
		setSelectedRating(null);
		setNewRating(null);
	};

	const fetchMore = (page) => {
		if (ratings.length % 10 === 0 && done) {
			addToRatings(10, page * 10);
		} else {
			setDone(false);
		}
	};

	return (
		<>
			{selectedRating && (
				<>
					<div
						className={styles.darken}
						onClick={() => setSelectedRating(null)}
					></div>
					<div className={styles.modal}>
						<h3>Update Rating</h3>
						<p>
							You are updating your rating for{" "}
							<b>{selectedRating.book_id.title}</b>.
						</p>
						<p>
							Upon submission of this form, the rating for this
							book will be amended, and all recommendations will
							be tuned appropriately.
						</p>
						<div className={styles.form}>
							<select
								onChange={(e) => setNewRating(e.target.value)}
								defaultValue="selected"
							>
								<option disabled="disabled" value="selected">
									Select Rating...
								</option>
								<option value="1">Liked</option>
								<option value="-1">Disliked</option>
								<option value="0">Not Read</option>
							</select>
						</div>
						<div className={styles.buttons}>
							<button onClick={() => handleUpdate()}>
								Update Rating
							</button>
						</div>
					</div>
				</>
			)}
			<div className={styles.pastRatings}>
				<BreadCrumb>
					<BreadCrumb.Item>
						<Link to={"/home"}>Home</Link>
					</BreadCrumb.Item>
					<BreadCrumb.Item>
						<Link to={"/profile"}>Profile</Link>
					</BreadCrumb.Item>
					<BreadCrumb.Item>My Past Ratings</BreadCrumb.Item>
				</BreadCrumb>
				<div className={styles.content}>
					<h3>My Past Ratings</h3>
					<List>
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchMore}
							hasMore={done}
							loader={<Loading />}
						>
							{ratings.length === 0 ? (
								<List.Item>No Books Rated</List.Item>
							) : (
								ratings.map((rating, index) => {
									let icon;
									switch (+rating.rating) {
										case 1:
											icon = (
												<FaHeart
													style={{
														fill:
															"rgb(88, 182, 88)",
													}}
												/>
											);
											break;
										case 0:
											icon = (
												<FaQuestion
													style={{
														fill:
															"rgb(56, 135, 255)",
													}}
												/>
											);
											break;
										case -1:
											icon = (
												<ImCross
													style={{
														fill:
															"rgb(255, 95, 95)",
													}}
												/>
											);
											break;
									}
									return (
										<List.Item
											key={index}
											onClick={() =>
												setSelectedRating(rating)
											}
										>
											<div className={styles.container}>
												{icon}
												<p>
													{rating.book_id.title}
													{rating.book_id
														.authors[0] &&
														` - ${rating.book_id.authors[0]}`}
												</p>
												<p>
													{moment(
														rating.createdAt
													).format(
														"DD/MM/YYYY HH:mm:ss"
													)}
												</p>
												<HiDotsHorizontal />
											</div>
										</List.Item>
									);
								})
							)}
						</InfiniteScroll>
					</List>
				</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	userState: state.user,
});

export default connect(mapStateToProps, {
	getRatings,
	updateRating,
	addToRatings,
})(PastRatings);
