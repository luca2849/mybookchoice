import React, { useState } from "react";
import { useSpring, useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-use-gesture";
import Book from "../Book/Book";

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
	x: i * -3,
	y: i * 10,
	scale: 1,
	rot: 0,
	delay: i * 100,
});
const from = (i) => ({ x: 0, rot: 0, scale: 1, y: 0 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
	`perspective(0px) rotateX(30deg) rotateY(${
		r / 10
	}deg) rotateZ(${r}deg) scale(${s})`;

const Deck = ({ books }) => {
	const [props, set] = useSprings(books.length, (i) => ({
		...to(i),
		from: from(i),
	}));
	return props.map(({ x, y, rot, scale }, i) => (
		<animated.div
			key={i}
			style={{
				transform: interpolate(
					[x, y],
					(x, y) => `translate3d(${x}px,${y}px,0)`
				),
			}}
		>
			{/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
			<animated.div
				style={{
					transform: interpolate([rot, scale], trans),
				}}
			>
				<Book book={books[books.length - 1 - i]} />
			</animated.div>
		</animated.div>
	));
};

export default Deck;
