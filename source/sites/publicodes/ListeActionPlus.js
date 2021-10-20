import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { title } from '../../components/publicodesUtils'

export default () => {
	const rules = useSelector((state) => state.rules)
	const plusListe = Object.entries(rules)
		.map(([dottedName, rule]) => ({ ...rule, dottedName }))
		.filter((r) => r.plus)

	return (
		<div className="ui__ container">
			<ScrollToTop />
			<h1>
				Nos explications complètes{' '}
				<img src="https://img.shields.io/badge/-beta-purple" />
			</h1>
			<p>
				<em>Découvrez les enjeux qui se cachent derrière chaque action.</em>
			</p>
			<CardGrid>
				{plusListe.map((rule) => (
					<li key={rule.dottedName}>
						<Link to={'/actions/plus/' + utils.encodeRuleName(rule.dottedName)}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									justify-content: space-evenly;
									width: 12rem;
									@media (max-width: 800px) {
										width: 9rem;
									}
									height: 10rem;
									img {
										font-size: 150%;
									}
								`}
							>
								<div>{emoji(rule.icônes || '🎯')}</div>
								<div>{title(rule)}</div>
							</div>
						</Link>
					</li>
				))}
			</CardGrid>
		</div>
	)
}

export const CardGrid = styled.ul`
	list-style-type: none;
	display: flex;
	flex-wrap: wrap;
	li {
		margin: 0.6rem;
		@media (max-width: 800px) {
			margin: 0.4rem;
		}
		text-align: center;
	}
	li > a {
		text-decoration: none;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 12rem;
		@media (max-width: 800px) {
			width: 10rem;
		}
		height: 10rem;
		img {
			font-size: 150%;
		}
	}
`
