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
	const chosen = actions.filter((a) => actionChoices[a.dottedName])
	const rejected = actions.filter((a) => actionChoices[a.dottedName] === false)
	const waiting = actions.filter((a) => actionChoices[a.dottedName] == null)

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
			<h2>Vos choix</h2>
			<List {...{ actions: chosen, rules, bilans }} />
			<h2>Catalogue</h2>

			<List {...{ actions: waiting, rules, bilans }} />
			<h2>Rejetées</h2>
			<List {...{ actions: rejected, rules, bilans }} />
		</div>
	)
}

const List = ({ actions, rules, bilans }) => (
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
					animate={{ scale: 1 }}
					initial={{ scale: 0.8 }}
					exit={{ scale: 0.8 }}
					transition={{ duration: 0.5 }}
					className="ui__ card"
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
