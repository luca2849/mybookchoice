import React from "react";
import { connect } from "react-redux";
import styles from "./ReadingList.module.css";
import List from "../../Components/List/List";
import Book from "../../Components/Book/Book";
// Eventually add remove from reading list

const ReadingList = ({ user: { user, loading } }) => {
	return (
		<div>
			<h3>Reading List</h3>
			<div className={styles.container}>
				{user.readingList.map((item, i) => (
					<Book book={item.book_id} />
				))}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth,
});

export default connect(mapStateToProps, {})(ReadingList);
