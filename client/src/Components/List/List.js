import React from "react";

import styles from "./List.module.css";

const List = ({ children, style, cssClass }) => {
	return (
		<div style={style} className={`${styles.list} ${cssClass}`}>
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
