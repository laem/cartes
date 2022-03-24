import styled from 'styled-components'
import useSound from 'use-sound'
import boopSfx from './bite.mp3'
import { Link } from 'react-router-dom'

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
	margin: 0 auto;

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
	const [play] = useSound(boopSfx)

	return (
		<button onClick={play}>
			<Link to={to} className="ui__ plain button">
				{children}
			</Link>
		</button>
	)
}
