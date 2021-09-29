import { EngineContext } from 'Components/utils/EngineContext'
import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { sortBy } from '../../utils'
import { ActionListCard } from './ActionVignette'

export default ({ actions, bilans, rules }) => {
	const engine = useContext(EngineContext)
	const missingVariables = actions.map(
			(action) => engine.evaluate(action.dottedName).missingVariables ?? {}
		),
		scores = missingVariables
			.map((part) => Object.entries(part))
			.flat()
			.reduce(
				(scores, [dottedName, score]) => ({
					...scores,
					[dottedName]: (scores[dottedName] ?? 0) + score,
				}),
				{}
			)

	const actionChoices = useSelector((state) => state.actionChoices)

	return (
		<div>
			<details>
				<summary>
					{actions.length} actions disponibles. {missingVariables.length}{' '}
					questions restantes.
				</summary>

				<ul>
					{sortBy(([, score]) => score)(Object.entries(scores))
						.reverse()
						.map(([dottedName, score]) => (
							<li>
								{dottedName} {score}
							</li>
						))}
				</ul>
			</details>
			<List {...{ actions, rules, bilans, actionChoices }} />
		</div>
	)
}

const List = ({ actions, rules, bilans, actionChoices }) => (
	<ul
		css={`
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			list-style-type: none;
			li {
				width: 12rem;
				height: 16rem;
				margin: 0.4rem;
			}
		`}
	>
		{actions.map((evaluation) => (
			<li
				className="ui__ card"
				css={`
					${actionChoices[evaluation.dottedName]
						? `border: 2px solid #77b255`
						: ''}
				`}
			>
				<ActionListCard
					key={evaluation.dottedName}
					rule={rules[evaluation.dottedName]}
					evaluation={evaluation}
					total={bilans.length ? bilans[0].nodeValue : null}
				/>
			</li>
		))}
	</ul>
)
