import React from "react";

import styles from "./BreadCrumb.module.css";

const BreadCrumb = ({ children, cssClass }) => {
	return (
		<div className={`${styles.crumb} ${cssClass}`}>
			{children.map((child, index) => (
				<div className={styles.item} key={index}>
					{child}
					{index + 1 < children.length && <span>/</span>}
				</div>
			))}
		</div>
	);
};

const Item = ({ children }) => {
	return children;
};

BreadCrumb.Item = Item;

export default BreadCrumb;
