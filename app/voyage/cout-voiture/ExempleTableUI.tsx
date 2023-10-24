'use client'

import styled from 'styled-components'
export const Table = styled.div`
	display: block;
	overflow-x: auto;
	white-space: nowrap;
`

export const VerticalOl = styled.ol`
	display: flex;
	flex-direction: column;
	list-style-type: none;
	img {
		width: 1rem;
		height: auto;
		filter: invert(1);
		vertical-align: text-bottom;
	}
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
	min-width: 36rem;
	justify-content: space-evenly;
	li {
		flex: 1;
		text-align: right;
	}
	li:first-child {
		text-align: left;
		line-height: 1.3rem;
		small {
			display: block;
		}
	}
	${(p) =>
		p.$spotlight &&
		`
	border: 2px solid var(--color);
	`}
`

export const PassengersButton = styled.button`
	padding: 0.4rem 1rem;
	display: block;
	margin: 1rem auto;
	font-size: 200%;
	display: flex;
	align-items: center;
	border: 1px solid var(--lightColor);
	background: var(--lightColor);
	color: var(--darkestColor);
	img {
		width: 2.5rem;
		height: 2.5rem;
	}
`

export const ExplanationBlock = styled.div`
	img {
		width: 3rem;
		height: auto;
	}
	display: flex;
	p {
		margin: 1rem;
		line-height: 1.2rem;
		font-style: italic;
	}
`
