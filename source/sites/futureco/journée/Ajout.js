import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Search from '../Search'
import Suggestions from '../Suggestions'

export default ({ items }) => {
	const [input, setInput] = useState('')

	const rules = useSelector(flatRulesSelector),
		suggestions = [
			'nourriture . Viennoiserie brioche - type brioche',
			'nourriture . Tasse de café',
			'douche . impact par douche',
			"transport . impact à l'usage",
			'numérique . téléphone journée',
			'nourriture . Steak-frites'
		]
	return (
		<div
			css={`
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				flex-direction: column;
				text-align: center;
				max-width: 30rem;
				margin: 0 auto;

				small {
					margin-bottom: 1rem;
				}
			`}
		>
			<h1>Qu'as-tu fait aujourd'hui&nbsp;?</h1>
			<small>Quelques idées :</small>
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
				{console.log(suggestions) ||
					suggestions
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
									`}
								>
									<Link
										to={'/journée/simulateur/' + encodeRuleName(dottedName)}
									>
										<button className="ui__ card">
											{emoji(icônes || '')} {title}
										</button>
									</Link>
									<button>{emoji('❌')}</button>
								</li>
							)
						})}
			</ul>
			<small>Autre chose</small>
			<Search {...{ input, setInput }} />
			{input && <Suggestions {...{ input }} />}
		</div>
	)
}
