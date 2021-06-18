import DocumentationButton from './DocumentationButton'
import { Link } from 'react-router-dom'
import Illustration from './images/ecolab-climat-dessin.svg'
import Marianne from './images/Marianne.png'
import emoji from 'react-easy-emoji'
import NewsBanner from '../../components/NewsBanner'

import { LoudButton } from './UI'
import Emoji from '../../components/Emoji'

export default () => {
	return (
		<div
			css={`
				height: 100%;
				> div > a {
				}
				text-align: center;
				img {
					height: 60%;
					object-fit: cover;
					width: 100vw;
					-webkit-mask-image: -webkit-gradient(
						linear,
						left top,
						left bottom,
						from(rgba(0, 0, 0, 1)),
						to(rgba(0, 0, 0, 0))
					);
				}
				h1 {
					font-size: 300%;
					margin-bottom: 0.6rem;
					line-height: 2.4rem;
					margin-top: -6rem;
				}
				h1 + p {
					margin-bottom: 1rem;
				}
				@media (min-width: 800px) {
					h1 {
						font-size: 400%;
						line-height: 4rem;
					}
				}
				strong {
				}
			`}
		>
			<img
				srcSet="https://i.imgur.com/HXWewY4l.jpg 640w, https://i.imgur.com/HXWewY4.jpg 1720w "
				src="https://i.imgur.com/HXWewY4.jpg"
			/>
			<div
				className="ui__ container"
				css={`
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					align-items: center;
					height: 48%;
					img {
						font-size: 140%;
						vertical-align: middle !important;
					}
					strong {
						background: var(--color);
					}
				`}
			>
				<header>
					<h1>
						T'es <strong>écolo</strong>,
						<br /> ou pas ?
					</h1>
					<p>
						<em>
							Le jeu dont <em>tu</em> es le héros.
						</em>
					</p>
				</header>
				<LoudButton to="instructions">Faire le test</LoudButton>
				<p>
					<Emoji e="⏱️" /> 2 minutes chrono
				</p>

				<footer css="display: flex; justify-content: center; align-items: center; height: 3rem">
					<div
						css={`
							display: flex;
							justify-content: center;
							flex-wrap: wrap;
							> * {
								margin: 0 0.6rem;
							}
						`}
					>
						<Link to="/à-propos">À propos</Link>
					</div>
					<img src="/logo.svg" css="width: 2rem !important" />
				</footer>
			</div>
		</div>
	)
}
