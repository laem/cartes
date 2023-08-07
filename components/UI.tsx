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
			<Button cta onClick={play}>
				{children}
			</Button>
		</Link>
	)
}

const Button = styled.button`
	padding: 0.3rem 0.8rem;
	background: var(--color2);
	color: white;
	font-size: 140%;
	border: none;
	cursor: pointer;
	${({ cta }) => cta && `padding: .8rem 1.4rem; font-weight: bold`}
`

export const Card = styled.li`
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
