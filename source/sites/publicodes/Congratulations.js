import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { Dialog } from './GameOver'
import { LoudButton } from './UI'

export const NotBad = ({ answeredRatio }) => {
	const dispatch = useDispatch()
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
				.confetti:nth-child(1) {
					background-color: #f2d74e;
					left: 10%;
					animation-delay: 0;
				}
				.confetti:nth-child(2) {
					background-color: #95c3de;
					left: 20%;
					animation-delay: -5s;
				}
				.confetti:nth-child(3) {
					background-color: #ff9a91;
					left: 30%;
					animation-delay: -3s;
				}
				.confetti:nth-child(4) {
					background-color: #f2d74e;
					left: 40%;
					animation-delay: -2.5s;
				}
				.confetti:nth-child(5) {
					background-color: #95c3de;
					left: 50%;
					animation-delay: -4s;
				}
				.confetti:nth-child(6) {
					background-color: #ff9a91;
					left: 60%;
					animation-delay: -6s;
				}
				.confetti:nth-child(7) {
					background-color: #f2d74e;
					left: 70%;
					animation-delay: -1.5s;
				}
				.confetti:nth-child(8) {
					background-color: #95c3de;
					left: 80%;
					animation-delay: -2s;
				}
				.confetti:nth-child(9) {
					background-color: #ff9a91;
					left: 90%;
					animation-delay: -3.5s;
				}
				.confetti:nth-child(10) {
					background-color: #f2d74e;
					left: 100%;
					animation-delay: -2.5s;
				}

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
						transform: rotateZ(15deg) rotateY(1440deg) translate(10vw, 100vh);
					}
				}
			`}
		>
			{[...new Array(10)].map((_, i) => (
				<div className="confetti" key={i} />
			))}
			<Dialog noEraser neutralColor>
				<h1>Pas mal ! {emoji('🧐')}</h1>
				<p>
					Tu as répondu à {Math.round(answeredRatio * 100)}% des questions du
					test.
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
