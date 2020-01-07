import React, { useEffect } from 'react'
import emoji from 'react-easy-emoji'

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
	scenario: { quota, warming }
}) {
	useEffect(() => {
		window.navigator.vibrate(200)
	}, [])
	return (
		<div css={blackScreenStyle}>
			{' '}
			{warming === '3' ? (
				<h1>Game over {emoji('😵')}, comme on dit.</h1>
			) : (
				<>
					<h1>
						{' '}
						+ {warming}° dépassé {emoji('🌡️🥵')}
					</h1>
					<p>
						La taille de cet écran est finie, tout comme les limites de notre
						planète bleue {emoji('🌍')}.
					</p>
					<p>
						Tu as dépassé le quota qui permet de limiter le réchauffement à +
						{warming}°.
					</p>

					<button className="ui__ button plain" onClick={setNextLimit}>
						Continuer ma journée
					</button>
				</>
			)}
		</div>
	)
}
