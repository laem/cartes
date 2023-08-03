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
		<Button onClick={play} href={to}>
			{children}
		</Button>
	)
}

const Button = styled.button`
	padding: 0.3rem 0.8rem;
	background: var(--color2);
	color: white;
	font-size: 140%;
	border: none;
`
