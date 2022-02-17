import React from 'react'
import emoji from 'react-easy-emoji'
import Emoji from 'Components/Emoji'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import scenarios from '../sites/publicodes/scenarios.yaml'

export default ({}) => {
	const location = useLocation()
	const scenarioName = useSelector((state) => state.scenario),
		scenario = scenarios[scenarioName],
		displayIntro = ['/wiki', '/contribuer/', '/à-propos'].includes(
			location.pathname
		)

	return (
		<section
			css={`
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 0.6rem;
				margin-bottom: 0;
			`}
		>
			<Link to="/" title="Revenir à l'accueil">
				<img
					width="5em"
					css={`
						width: ${displayIntro ? '8em' : '5em'};
						@media (max-width: 800px) {
							${displayIntro ? 'display: none;' : ''}
						}
						margin-right: 1em;
					`}
					src={'/logo.svg'}
					alt=""
				/>
			</Link>
			{displayIntro && (
				<p
					id="intro"
					css="max-width: 60%; line-height: 1.4rem; margin-right: 1em; "
				>
					La catastrophe climatique n'est plus une menace lointaine, c'est une
					actualité.&nbsp;<Link to="/à-propos">En savoir plus</Link>.
				</p>
			)}
			{!location.pathname.includes('/scénarios') && (
				<div
					css={`
						img {
							width: 2rem;
							height: auto;
						}
					`}
				>
					<Link to="/scénarios" title="Paramètres">
						<Emoji e="⚙️" />
					</Link>
				</div>
			)}
		</section>
	)
}
