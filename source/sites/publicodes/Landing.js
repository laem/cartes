import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import Suggestions from './Suggestions'
import { Link } from 'react-router-dom'
import Illustration from './images/ecolab-climat-dessin.svg'
import emoji from 'react-easy-emoji'

export default () => {
	return (
		<div
			css={`
				border-radius: 1rem;
				padding: 0.4rem;
				h1 {
					margin-top: 0.3rem;
					font-size: 140%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
				> img {
					width: 70%;
					border-radius: 0.8rem;
				}
				@media (max-width: 800px) {
					> img {
						width: 95%;
					}
				}
			`}
		>
			<h1>Connaissez-vous votre empreinte sur le climat ?</h1>
			<img src={Illustration} />
			<div css="margin: 1rem 0 2rem;">
				<Link to="/simulateur/bilan" className="ui__ plain button">
					Faire le test
				</Link>
			</div>
			<footer>
				<div
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 1rem;
						img {
							margin-left: 0.4rem;
						}
					`}
				>
					<a href="https://ademe.fr">
						<img
							css="height: 4rem; margin-right: .6rem"
							src="https://www.ademe.fr/sites/all/themes/ademe/logo.png"
						/>
					</a>
					<a href="https://www.associationbilancarbone.fr/">
						<img
							css="height: 2.5rem"
							src="https://www.associationbilancarbone.fr/wp-content/themes/abc/assets/images/brand/abc_main_logo.svg"
						/>
					</a>
				</div>
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
					<a href="https://github.com/betagouv/ecolab-data#ecolab-climat-">
						{emoji('🖊️ ')}
						Contribuer
					</a>
					<DocumentationButton />
					<Link to="/vie-privée">
						{emoji('🙈 ')}
						Vie privée
					</Link>
				</div>
			</footer>
		</div>
	)
}
