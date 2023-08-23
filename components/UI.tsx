'use client'

import styled from 'styled-components'
import useSound from 'use-sound'
import Link from 'next/link'

export const GameDialog = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	text-align: center;
	height: 90%;
	font-size: 120%;
	h1 {
		font-size: 230%;
		margin-top: 0rem;
	}
	max-width: 550px;
	width: 90vw;
	margin: 1rem auto;

	@media (min-width: 800px) {
		justify-content: center;
	}

	p {
		margin: 0.6rem 0;
	}
	button {
		margin: 1rem;
	}

	strong {
		color: var(--color);
	}
`
export const LoudButton = ({ to, children }) => {
	const [play] = useSound('/sounds/bite.mp3')

	return (
		<Link href={to}>
			<Button cta="true" onClick={play}>
				{children}
			</Button>
		</Link>
	)
}

export const Button = styled.button`
	border-radius: 0.3rem;
	padding: 0.3rem 0.8rem;
	background-image: linear-gradient(
		50deg,
		var(--darkColor) 80%,
		var(--color) 100%
	);
	border: 1px solid var(--color);
	background-position-x: 99%;
	background-size: 280%;
	transition: all 0.08s;
	color: white;
	cursor: pointer;
	font-size: 120%;
	${({ cta }) =>
		cta &&
		`
	font-size: 140%;
	padding: .8rem 1.4rem; font-weight: bold;
	`}
	&:hover {
		background-position-x: 0;
	}
`

export const LightButton = styled.button`
	background: #0000;
	border: none;
	color: var(--lightColor);
	padding-left: 0;
	padding-right: 0;
	border-radius: 0.3rem;
	font-size: 90%;
	font-weight: 500;
	line-height: 1.2rem;
	padding: 0.4rem 0.8rem;
	transition: all 0.08s;
	width: inherit;
	cursor: pointer;
	display: inline-block;
	text-align: center;
	text-decoration: none;
	&:hover {
		opacity: 0.8;
		transform: translateX(-3px);
	}
	${(props) =>
		props.$dashedBottom &&
		`
	border-bottom: 1px dashed;
border-radius: 0px;
padding: .2rem;
`}
`

export const LightCard = styled.li`
	min-width: 12rem;
	padding: 1rem;
	margin: 1rem;
	list-style-type: none;
	border: 1px solid #0000006b;
	border-radius: 0.2rem;

	--shadow-color: 0deg 0% 63%;
	--shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
		0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
		2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
		5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
	box-shadow: var(--shadow-elevation-medium);
	@media (max-width: 800px) {
		min-width: 8rem;
	}
`

export const Card = styled.div`
	align-items: center;
	color: inherit;
	display: flex;
	flex: 0.3;
	flex-direction: column;
	font-size: inherit !important;
	margin: 0.6rem;
	max-width: 18rem;
	padding: 1rem;
	text-align: center;
	text-decoration: none;

	border: 4px solid var(--darkerColor);
	border-radius: 0.3rem;
	background: var(--darkerColor2);
	box-shadow: 0 1px 3px rgba(var(--rgbColor), 0.12),
		0 1px 2px rgba(var(--rgbColor), 0.24);
	padding-left: 1rem;
	padding-right: 1rem;
	transition: box-shadow 0.15s, border-color 0.15s;

	&:hover {
		border-color: var(--lightColor);
		box-shadow: 0 2px 4px -1px rgba(var(--rgbColor), 0.2),
			0 4px 5px 0 rgba(var(--rgbColor), 0.14),
			0 1px 10px 0 rgba(var(--rgbColor), 0.12);
		opacity: inherit !important;
	}
	${(props) =>
		props.$fullWidth &&
		`max-width: 100%; display: block; flex: unset; text-align: left `}
`

export const InlineImage = styled.span`
	img {
		width: 2rem;
		height: 2rem;
	}
`
