import { EngineContext } from 'Components/utils/EngineContext'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { correctValue } from '../../components/publicodesUtils'
import { sortBy } from '../../utils'
import ActionConversation from './ActionConversation'
import { ActionListCard } from './ActionVignette'
import animate from 'Components/ui/animate'
import { ScrollToElement } from '../../components/utils/Scroll'
import DisableScroll from '../../components/utils/DisableScroll'
import IllustratedButton from '../../components/IllustratedButton'

export default ({ actions, bilans, rules }) => {
	const engine = useContext(EngineContext)

	const actionChoices = useSelector((state) => state.actionChoices)
	const [focusedAction, focusAction] = useState(null)
	const rejected = actions.filter((a) => actionChoices[a.dottedName] === false)
	const notRejected = actions.filter(
		(a) => actionChoices[a.dottedName] !== false
	)
	const maxImpactAction = notRejected.reduce(
		(memo, next) => {
			const nextValue = correctValue({
				nodeValue: next.nodeValue,
				unit: next.unit,
			})

			const memoValue = correctValue({
				nodeValue: memo.nodeValue,
				unit: memo.unit,
			})
			return nextValue > memoValue ? { ...next, value: nextValue } : memo
		},
		{ nodeValue: 0 }
	)

	return (
		<div>
			{maxImpactAction.value < 100 && (
				<animate.fromTop>
					<div
						className="ui__ card box"
						css="margin: 0 auto .6rem !important; "
					>
						<p>
							Nous n'avons plus d'actions chiffrées très impactantes à vous
							proposer {emoji('🤷')}
						</p>
						<p>
							Découvrez plus bas quelques pistes pour agir autrement{' '}
							{emoji('⏬')}
						</p>
					</div>
				</animate.fromTop>
			)}
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
			<IllustratedButton icon="📚" to="/actions/plus">
				<div>
					<h3>Aller plus loin</h3>
					<p>
						<small>
							Au-delà d'un simple chiffre, découvrez les enjeux qui se cachent
							derrière chaque action.
						</small>
					</p>
				</div>
			</IllustratedButton>
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
			padding-left: 0;
		`}
	>
		<AnimatePresence>
			{actions.map((evaluation) => {
				const cardComponent = (
					<motion.li
						key={evaluation.dottedName}
						layoutId={evaluation.dottedName}
						animate={{ scale: 1 }}
						initial={{ scale: 0.8 }}
						exit={{ scale: 0.2 }}
						transition={{ duration: 1 }}
						css={`
							width: 11rem;
							height: 16rem;
							margin: 0.4rem;

							@media (min-width: 800px) {
								width: 12rem;
							}
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
				)
				if (focusedAction === evaluation.dottedName) {
					const convId = 'conv'
					return (
						<>
							<motion.li
								key={convId}
								layoutId={convId}
								animate={{ scale: 1 }}
								initial={{ scale: 0.8 }}
								exit={{ scale: 0.2 }}
								transition={{ duration: 0.5 }}
								css={`
									margin-top: 1.6rem 1rem 1rem;
									width: 100%;
									height: auto;
								`}
							>
								<ActionConversation
									key={focusedAction}
									dottedName={focusedAction}
								/>
								<ScrollToElement delay={1000} center />
							</motion.li>
							{cardComponent}
						</>
					)
				}
				return cardComponent
			})}
		</AnimatePresence>
	</ul>
)
