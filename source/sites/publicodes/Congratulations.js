import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { Dialog } from './GameOver'
import { LoudButton } from './UI'
import tinygradient from 'tinygradient'
import { colorScale } from './Simulateur'

export const NotBad = ({ answeredRatio }) => (
	<CongratulationScreen
		confettisAmount={10}
		name={'notBad'}
		buttonText="Au boulot ! "
	>
		<h1>Pas mal ! {emoji('🧐')}</h1>
		<p>
			Tu as répondu à <strong>{Math.round(answeredRatio * 100)}% </strong>
			des questions du test.
		</p>
		<p>
			Beaucoup de gens sont <strong>déjà hors-jeu.</strong>
		</p>
		<p>
			Mais garde les pieds sur terre, il te reste encore l'essentiel à faire.
		</p>
	</CongratulationScreen>
)

export const QuiteGood = ({ answeredRatio }) => (
	<CongratulationScreen
		confettisAmount={20}
		name={'quiteGood'}
		buttonText="C'est reparti !"
	>
		<h1>Eh ben ! {emoji('😌')}</h1>
		<p>
			Tu as répondu à <strong>{Math.round(answeredRatio * 100)}% </strong>
			des questions du test.
		</p>
		<p>
			C'est déjà <strong>pas mal </strong> !
		</p>
		<p>Mais encore loin du but...</p>
	</CongratulationScreen>
)
export const Half = ({ answeredRatio }) => (
	<CongratulationScreen
		confettisAmount={30}
		name={'half'}
		buttonText="Courage !"
	>
		<h1>Mais dis-donc ! {emoji('☺️')}</h1>
		<p>
			Tu as répondu à <strong>{Math.round(answeredRatio * 100)}% </strong>
			des questions du test.
		</p>
		<p>
			Avoir déjà fait la moitié du chemin, c'est{' '}
			<strong>une petite victoire</strong> !
		</p>
		<p>Pourras-tu tenir la deuxième moitié du test ?</p>
	</CongratulationScreen>
)
export const Almost = ({ answeredRatio }) => (
	<CongratulationScreen
		confettisAmount={40}
		name={'almost'}
		buttonText="En finir !"
	>
		<h1>Oh la la ! {emoji('😃')}</h1>
		<p>
			Tu as répondu à <strong>{Math.round(answeredRatio * 100)}% </strong>
			des questions du test.
		</p>
		<p>
			C'est <strong>remarquable</strong> !
		</p>
		<p>Plus qu'un dernier bout de chemin à faire...</p>
	</CongratulationScreen>
)
export const Done = () => (
	<CongratulationScreen
		confettisAmount={60}
		name={'done'}
		buttonText="Et maintenant ?"
	>
		<h1> Exceptionnel ! {emoji('😍')}</h1>
		<p>Tu as passé le test.</p>
		<p>
			C'est <strong>extrêmement rare</strong> !
		</p>
	</CongratulationScreen>
)

export const CongratulationScreen = ({
	name,
	confettisAmount = 20,
	children,
	buttonText,
}) => {
	const dispatch = useDispatch()
	const confettis = [...new Array(confettisAmount)]
	const gradientColors = tinygradient(colorScale).rgb(confettisAmount)

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
				{children}
				<div
					onClick={() => dispatch({ type: 'SET_MESSAGE_READ', message: name })}
				>
					<LoudButton>{buttonText}</LoudButton>
				</div>
			</Dialog>
		</div>
	)
}
