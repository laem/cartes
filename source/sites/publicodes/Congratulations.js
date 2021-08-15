import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { Dialog } from './GameOver'
import { LoudButton } from './UI'
import tinygradient from 'tinygradient'
import { colorScale } from './Simulateur'

export const NotBad = ({ answeredRatio }) => {
	const dispatch = useDispatch()
	const number = 20
	const confettis = [...new Array(number)]
	const gradientColors = tinygradient(colorScale).rgb(number)

	return (
		<div
			css={`
				width: 100%;
				height: 100%;
				.confetti {
					width: 15px;
					height: 15px;
					background-color: #f2d74e;
					position: absolute;
					left: 50%;
					animation: confetti 5s ease-in-out -2s infinite;
					transform-origin: left top;
				}
				${confettis.map(
					(_, i) => `

				.confetti:nth-child(${i + 1}) {
					background-color: ${gradientColors[i]};
					left: ${(100 / confettis.length) * i}%;
					animation-delay: ${Math.random() * 5 - 5}s;
				}

				`
				)}

				@keyframes confetti {
					0% {
						transform: rotateZ(15deg) rotateY(0deg) translate(0, 0);
					}
					25% {
						transform: rotateZ(5deg) rotateY(360deg) translate(-5vw, 20vh);
					}
					50% {
						transform: rotateZ(15deg) rotateY(720deg) translate(5vw, 60vh);
					}
					75% {
						transform: rotateZ(5deg) rotateY(1080deg) translate(-10vw, 80vh);
					}
					100% {
						transform: rotateZ(15deg) rotateY(1440deg) translate(10vw, 96vh);
					}
				}
			`}
		>
			{confettis.map((_, i) => (
				<div className="confetti" key={i} />
			))}
			<Dialog noEraser neutralColor>
				<h1>Pas mal ! {emoji('🧐')}</h1>
				<p>
					Tu as répondu à <strong>{Math.round(answeredRatio * 100)}% </strong>
					des questions du test.
				</p>
				<p>
					Beaucoup de gens sont <strong>déjà hors-jeu.</strong>
				</p>
				<p>
					Mais garde les pieds sur terre, il te reste encore l'essentiel à
					faire.
				</p>
				<div
					onClick={() =>
						dispatch({ type: 'SET_MESSAGE_READ', message: 'notBad' })
					}
				>
					<LoudButton>Au boulot !</LoudButton>
				</div>
			</Dialog>
		</div>
	)
}
