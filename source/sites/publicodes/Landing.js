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
					font-size: 350%;
					margin-bottom: 2rem;
				}
				strong {
					color: var(--color);
				}
			`}
		>
			<img src="https://i.guim.co.uk/img/media/928676ae85002ab72555193db814fe0e0e8822fc/0_0_4896_3368/master/4896.jpg?width=700&quality=85&auto=format&fit=max&s=220cd2e957b4d1d02773c0aa3927f34d" />
			<div
				className="ui__ container"
				css={`
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					height: 50%;
				`}
			>
				<header>
					<h1>Écolo, ou pas ?</h1>
					<p>
						<em>
							Le jeu dont <strong>vous</strong> êtes le héros.
						</em>
					</p>
				</header>
				<div css="">
					<Link to="/simulateur/bilan" className="ui__ plain button">
						Faire le test
					</Link>
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
		</div>
	)
}
