import { EngineContext } from 'Components/utils/EngineContext'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { sortBy } from '../../utils'
import ActionConversation from './ActionConversation'
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
	const [focusedAction, focusAction] = useState(null)
	const rejected = actions.filter((a) => actionChoices[a.dottedName] === false)
	const notRejected = actions.filter(
		(a) => actionChoices[a.dottedName] !== false
	)

	return (
		<div>
			{focusedAction && (
				<ActionConversation key={focusedAction} dottedName={focusedAction} />
			)}
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
			<List
				{...{
					actions: notRejected,
					rules,
					bilans,
					actionChoices,

					focusAction,
					focusedAction,
				}}
			/>
			{rejected.length > 0 && (
				<div>
					<h2>Actions écartées</h2>
					<List
						{...{
							actions: rejected,
							rules,
							bilans,
							actionChoices,
							focusAction,
							focusedAction,
						}}
					/>
				</div>
			)}
		</div>
	)
}

const List = ({
	actions,
	rules,
	bilans,
	actionChoices,
	focusedAction,
	focusAction,
}) => (
	<ul
		css={`
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			list-style-type: none;
			li {
				width: 11rem;
				height: 16rem;
				margin: 0.4rem;
			}
			@media (min-width: 800px) {
				li {
					width: 12rem;
				}
			}
			padding-left: 0;
		`}
	>
		<AnimatePresence>
			{actions.map((evaluation) => (
				<motion.li
					key={evaluation.dottedName}
					layoutId={evaluation.dottedName}
					animate={{ scale: 1 }}
					initial={{ scale: 0.8 }}
					exit={{ scale: 0.2 }}
					transition={{ duration: 0.5 }}
					className="ui__ interactive card light-border"
					css={`
						${focusedAction === evaluation.dottedName
							? `border: 4px solid var(--color) !important;`
							: ''}
						${actionChoices[evaluation.dottedName]
							? `border: 4px solid #77b255 !important;`
							: ''}
					`}
				>
					<ActionListCard
						focusAction={focusAction}
						focused={focusedAction === evaluation.dottedName}
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
