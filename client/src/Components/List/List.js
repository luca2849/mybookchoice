import React from "react";

import styles from "./List.module.css";

const List = ({ children }) => {
	return <div className={styles.list}>{children}</div>;
};

const Item = ({ children, onClick }) => {
	return (
		<div onClick={onClick} className={styles.item}>
			<p>{children}</p>
		</div>
	);
};

List.Item = Item;

export default List;
