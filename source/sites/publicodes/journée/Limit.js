import React, { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

const blackScreenStyle = `
		background: black;
		width: 100vw;
		height: 100vh;
		color: white;
		button, h1 {
			color: white;
		}
		display: flex; flex-direction: column; justify-content: center;
		padding: 2rem;
`

export default function LimitReached({
	setNextLimit,
	scenarioData: { réchauffement }
}) {
	useEffect(() => {
		window.navigator.vibrate(200)
	}, [])
	return (
		<div css={blackScreenStyle}>
			{' '}
			{réchauffement === '3' ? (
				<>
					<h1>Game over {emoji('😵')}</h1>
					<p css="width: 20rem; margin: 0 auto">
						Espérons que les astronomes bossent bien, car il faudra plusieurs
						autres {emoji('🌍')} pour encaisser ta consommation personnelle.
					</p>
				</>
			) : (
				<>
					<h1>
						{' '}
						+ {réchauffement}° dépassé {emoji('🌡️🥵')}
					</h1>
					<p>
						La taille de cet écran est finie, tout comme les limites de notre
						planète bleue {emoji('🌍')}.
					</p>
					<p>
						Tu as dépassé le quota qui permet de limiter le réchauffement à +
						{réchauffement}°.
					</p>
					<Link to="/journée/thermomètre">
						<button
							className="ui__ button plain"
							onClick={() => setNextLimit()}
						>
							Continuer ma journée
						</button>
					</Link>
				</>
			)}
		</div>
	)
}
