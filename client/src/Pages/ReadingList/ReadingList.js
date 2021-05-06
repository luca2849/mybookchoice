import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styles from "./ReadingList.module.css";
import { deleteBookFromList } from "../../actions/user";
import Book from "../../Components/Book/Book";
import { ImBin } from "react-icons/im";
// Eventually add remove from reading list

const ReadingList = ({ user: { user, loading }, deleteBookFromList }) => {
	const handleDelete = (id) => {
		deleteBookFromList(id);
	};
	return (
		<div className={styles.container}>
			<h3>Reading List</h3>
			<div className={styles.books}>
				{!loading && user.readingList.length === 0 && (
					<div className={styles.noBooks}>
						<h4>No Books in Reading List.</h4>
						<p>
							Click <Link to={"/recommend"}>here</Link> to gather
							book recommendations to add to this list.
						</p>
					</div>
				)}
				{user.readingList.map((item, i) => (
					<div className={styles.bookContainer} key={i}>
						<div
							className={styles.iconContainer}
							onClick={() => handleDelete(item.book_id._id)}
						>
							<ImBin />
						</div>
						<Book
							book={item.book_id}
							cssClass={styles.hoverChange}
							link={true}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth,
});

export default connect(mapStateToProps, { deleteBookFromList })(ReadingList);
