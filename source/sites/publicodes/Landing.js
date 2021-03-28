import React from 'react'
import ContributionButton from './ContributionButton'
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
					height: 50%;
					object-fit: cover;
					width: 100vw;
				}
				h1 {
					font-size: 300%;
					margin-bottom: 0.6rem;
					line-height: 2.4rem;
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
				`}
			>
				<header>
					<h1>
						Écolo,
						<br /> ou pas ?
					</h1>
					<p>
						<em>
							Le jeu dont <strong>vous</strong> êtes le héros.
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
