import React, { useState } from "react";
import Book from "../Book/Book";

import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import Loading from "../../Components/Misc/Loading/Loading";

const Deck = ({ books, height, choiceEvent, loading, isMobile, translate }) => {
	// UseGesture
	const [{ x }, api] = useSpring(() => ({ x: 0, y: 0 }));

	// Set the drag hook and define component movement based on gesture data
	const bind = useDrag(({ down, previous, initial, movement: [mx] }) => {
		const diff = initial[0] - previous[0];
		// If movement done, and over 200px threshold
		const threshold = isMobile ? 50 : 200;
		if (!down && Math.abs(diff) > threshold) {
			if (diff > 0) {
				// disliked
				choiceEvent(-1);
			} else {
				// liked
				choiceEvent(1);
			}
		}
		api({ x: down ? mx : 0 });
	});

	return loading ? (
		<Loading />
	) : (
		books.map((book, i) => (
			<animated.div
				{...bind()}
				style={{
					transform: x.interpolate((x) =>
						translate
							? `translate3d(calc(-50% + ${x}px),-50%,0)`
							: `translate3d(${x}px,0,0)`
					),
				}}
				key={i}
			>
				{/* <p style={{ pointerEvents: "none", userSelect: "none" }}>Hello</p> */}
				<Book book={book} height={height} link={false} />
			</animated.div>
		))
	);
};

export default Deck;
