import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Search from '../Search'
import Suggestions from '../Suggestions'

export default ({ click, items }) => {
	const [input, setInput] = useState('')

	const rules = useSelector(flatRulesSelector),
		suggestions = [
			'nourriture . Viennoiserie brioche - type brioche',
			'nourriture . Tasse de café',
			'douche . impact par douche',
			"transport . impact à l'usage",
			'électronique . téléphone . impact'
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
			`}
		>
			<h1>Qu'as-tu fait aujourd'hui ? </h1>
			<small>Suggestions</small>
			<ul
				css={`
					margin-bottom: 2rem;
					li {
						margin: 1rem 2rem;
						list-style-type: none;
						width: 100%;
					}

					img {
						font-size: 150%;
					}
				`}
			>
				{suggestions
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
									to={
										typeof formule !== 'number' // TODO this test is not complete, some variables can have formulas but no questions, so no need to simulate
											? '/journée/simulateur/' + encodeRuleName(dottedName)
											: '/journée/thermomètre'
									}
								>
									<button
										className="ui__ card"
										onClick={() => click(dottedName)}
									>
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
