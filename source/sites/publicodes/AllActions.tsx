import { EngineContext } from 'Components/utils/EngineContext'
import { AnimatePresence, motion } from 'framer-motion'
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
	const rejected = actions.filter((a) => actionChoices[a.dottedName] === false)
	const notRejected = actions.filter(
		(a) => actionChoices[a.dottedName] !== false
	)

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
			<List {...{ actions: notRejected, rules, bilans, actionChoices }} />
			{rejected.length > 0 && (
				<div>
					<h2>Actions écartées</h2>
					<List {...{ actions: rejected, rules, bilans, actionChoices }} />
				</div>
			)}
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
		<AnimatePresence>
			{actions.map((evaluation) => (
				<motion.li
					key={evaluation.dottedName}
					animate={{ scale: 1 }}
					initial={{ scale: 0.8 }}
					exit={{ scale: 0.2 }}
					transition={{ duration: 0.5 }}
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
				</motion.li>
			))}
		</AnimatePresence>
	</ul>
)
