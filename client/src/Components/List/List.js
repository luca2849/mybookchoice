import React from "react";

import styles from "./List.module.css";

const List = ({ children, style }) => {
	return (
		<div style={style} className={styles.list}>
			{children}
		</div>
	);
};

const Item = ({ children, onClick, cssClass }) => {
	return (
		<div onClick={onClick} className={`${styles.item} ${cssClass}`}>
			{children}
		</div>
	);
};

List.Item = Item;

export default List;
