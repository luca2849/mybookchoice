import React, { useState } from "react";
import Select from "react-select";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

import styles from "./MessagesHeader.module.css";

import Modal from "../../Components/Modal/Modal";

const MessagesHeader = ({ friends, createThread }) => {
	const cleanFriendsList = friends.map((friend) => {
		return {
			value: friend.user.username,
			label: `${friend.user.name} (${friend.user.username})`,
		};
	});
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const handleCreateThread = () => {
		createThread(selectedUser);
		setModalOpen(false);
	};
	return (
		<>
			<div className={styles.container}>
				<h4>My Messages</h4>
				<div
					className={styles.addThreadContainer}
					onClick={() => setModalOpen(true)}
				>
					<AiOutlinePlus />
				</div>
			</div>
			<Modal
				open={modalOpen}
				openHandler={setModalOpen}
				cssClass={styles.modal}
			>
				<div className={styles.modalHeader}>
					<h1>Create a Thread</h1>
					<GrClose onClick={() => setModalOpen(false)} />
				</div>
				<div className={styles.content}>
					<h4>Select a Friend</h4>
					<Select
						options={cleanFriendsList}
						onChange={(e) => setSelectedUser(e.value)}
					/>
					<div className={styles.createThread}>
						<button onClick={() => handleCreateThread()}>
							Create Thread
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default MessagesHeader;
