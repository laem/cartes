import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import { Link } from 'react-router-dom'
import Illustration from './images/ecolab-climat-dessin.svg'
import Marianne from './images/Marianne.png'
import emoji from 'react-easy-emoji'
import NewsBanner from '../../components/NewsBanner'

export default () => {
	return (
		<div
			css={`
				border-radius: 1rem;
				padding: 0.4rem;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				h1 {
					margin: 0.3rem 0;
					font-size: 140%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
				> img {
					width: 70%;
					border-radius: 0.8rem;
					margin: 2rem auto;
				}
				@media (max-width: 800px) {
					> img {
						width: 95%;
					}
				}
			`}
		>
			<h1>Êtes-vous écolo ?</h1>
			<p>
				<em>
					Le jeu dont <strong>vous</strong> êtes le héros.
				</em>
			</p>
			<img src="https://i.guim.co.uk/img/media/928676ae85002ab72555193db814fe0e0e8822fc/0_0_4896_3368/master/4896.jpg?width=700&quality=85&auto=format&fit=max&s=220cd2e957b4d1d02773c0aa3927f34d" />
			<div css="margin-bottom: 1rem">
				<div css="margin: 1rem 0 .6rem;">
					<Link to="/simulateur/bilan" className="ui__ plain button">
						Faire le test
					</Link>
				</div>
			</div>

			<footer>
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
			</footer>
		</div>
	)
}
