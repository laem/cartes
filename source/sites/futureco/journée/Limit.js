import { Markdown } from 'Components/utils/markdown'
import React, { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

const blackScreenStyle = `
		background: black;
		width: 100vw;
		height: 100vh;
		color: white;
		h1{margin: 0 0 1.6rem;font-size: 300%}
		button, h1 {
			color: white;
		}
		display: flex; flex-direction: column; justify-content: center;
		padding: 2rem;
		text-align: center;
		p {
			line-height: 1.3rem
		}
		> a {
margin-top: 1.4rem;
		}
`

export default function LimitReached({
	setNextLimit,
	scenarioData: { réchauffement, message, titre }
}) {
	useEffect(() => {
		window.navigator.vibrate(200)
	}, [])
	const gameOver = titre.includes('change rien')
	return (
		<div css={blackScreenStyle}>
			<>
				{!gameOver && (
					<h1>
						{emoji('🌡️')} {réchauffement}
					</h1>
				)}
				<Markdown source={message} />
				{!gameOver && (
					<Link to="/journée/thermomètre">
						<button
							className="ui__ button plain"
							onClick={() => setNextLimit()}
						>
							Continuer ma journée
						</button>
					</Link>
				)}
			</>
		</div>
	)
}
