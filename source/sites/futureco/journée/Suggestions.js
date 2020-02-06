import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { StoreContext } from '../StoreContext'

const suggestions = [
	'nourriture . Viennoiserie brioche - type brioche',
	'nourriture . Tasse de café',
	'douche . impact par douche',
	"transport . impact à l'usage",
	'numérique . téléphone journée',

	'nourriture . Steak-frites',
	'nourriture . Salade verte - avec sauce'
]

export default ({ rules }) => {
	const {
		state: { items, crossedSuggestions },
		dispatch
	} = useContext(StoreContext)
	return (
		<div>
			<small>Suggestions</small>
			<ul
				css={`
					padding: 0;
					margin-bottom: 2rem;
					li {
						margin: 0 0 1rem;
						list-style-type: none;
						width: 100%;
					}
					img {
						font-size: 150%;
					}
				`}
			>
				{suggestions
					.filter(s => !crossedSuggestions.includes(s))
					.map(dottedName => findRuleByDottedName(rules, dottedName))
					.filter(
						({ journée, dottedName }) =>
							(journée && journée['se répète']) ||
							!items.find(item => item.dottedName === dottedName)
					)
					.map(item => {
						let { title, icônes, dottedName, formule } = item
						return (
							<li
								key={title}
								css={`
									a,
									a button {
										width: 80%;
									}
									a button {
										padding: 0.6rem;
									}
									> button {
										padding: 0;
									}
								`}
							>
								<Link to={'/journée/simulateur/' + encodeRuleName(dottedName)}>
									<button className="ui__ card">
										{emoji(icônes || '')} {title}
									</button>
								</Link>
								<button
									onClick={() =>
										dispatch({
											type: 'CROSS_SUGGESTION',
											suggestion: dottedName
										})
									}
								>
									{emoji('✖')}
								</button>
							</li>
						)
					})}
			</ul>
		</div>
	)
}
