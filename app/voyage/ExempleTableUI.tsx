'use client'

import styled from 'styled-components'

export const VerticalOl = styled.ol`
	display: flex;
	flex-direction: column;
	list-style-type: none;
`
export const HorizontalOl = styled.ol`
	${(p) =>
		!p.$header &&
		`
	background: var(--darkestColor);
	border: 2px solid var(--darkerColor);
	`}
	margin: 0.4rem 0;
	padding: 0.1rem 0.6rem;
	border-radius: 0.4rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	list-style-type: none;
	width: 100%;
	justify-content: space-evenly;
	li {
		flex: 1;
	}
	li small {
		display: block;
	}
`
