import React, { useEffect } from "react";
import styles from "./Modal.module.css";
const Modal = ({ open, children, openHandler, cssClass }) => {
	document.body.setAttribute("style", "");
	if (open) {
		const windowOffset = window.scrollY;
		document.body.setAttribute(
			"style",
			`position: fixed; top: -${windowOffset}px; left: 0; right: 0`
		);
	} else {
		document.body.setAttribute("style", "");
	}
	return open ? (
		<>
			<div onClick={() => openHandler(false)} className={styles.bg}></div>
			<div className={styles.modalContainer}>
				<div className={`${styles.modal} ${cssClass}`}>{children}</div>
			</div>
		</>
	) : (
		<></>
	);
};

export default Modal;
