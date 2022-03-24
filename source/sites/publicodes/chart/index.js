import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { useNextQuestions } from '../../../components/utils/useNextQuestion'
import Bar from './Bar'

const showBudget = false
const // Rough estimate of the 2050 budget per person to stay under 2° by 2100
	climateBudgetPerYear = 2000,
	climateBudgetPerDay = climateBudgetPerYear / 365,
	// Based on current share of the annual mean of 12 ton per french
	// Source : http://ravijen.fr/?p=440
	transportShare = 1 / 4,
	transportClimateBudget = climateBudgetPerDay * transportShare

export default ({
	details,
	noText,
	noAnimation,
	noCompletion,
	valueColor,
	links,
}) => {
	// needed for this component to refresh on situation change :
	const situation = useSelector(situationSelector)
	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)
	const categories = extractCategories(rules, engine, details)
	const nextQuestions = useNextQuestions()
	const completedCategories = categories
		.filter(
			({ dottedName }) =>
				!nextQuestions.find((question) => question.includes(dottedName))
		)
		.map(({ dottedName }) => dottedName)

	if (!categories) return null

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	return (
		<section
			css={`
				h2 {
					margin: 0.6rem 0 0.1rem;
					font-size: 140%;
				}
				padding: 0;
			`}
		>
			<div
				css={`
					position: relative;
				`}
			>
				<span
					css={`
				${!showBudget ? 'display: none' : ''}
				height: 100%;
				left: 0;
				z-index: -1;
				left: ${((transportClimateBudget * 1000) / empreinteMaximum) * 100 * 0.9}%;

				width: 0px;
				border-right: 8px dotted yellow;
		        position: absolute;
				margin-top: 2rem;
				}
					`}
					key="budget"
				></span>
				<ul
					css={`
						margin-left: 2rem;

						@media (min-width: 800px) {
							max-width: 35rem;
						}
					`}
				>
					{categories.map((category) => {
						const bar = (
							<Bar
								{...{
									...category,
									noText,
									empreinteMaximum,
									completed:
										!noCompletion &&
										completedCategories.find((c) => c === category.dottedName),
									valueColor,
								}}
							/>
						)
						return (
							<motion.li
								layoutTransition={
									noAnimation
										? null
										: {
												type: 'spring',
												damping: 100,
												stiffness: 100,
										  }
								}
								key={category.title}
								css={`
									margin: 0.4rem 0;
									list-style-type: none;
									> a {
										display: block;
										text-decoration: none;
										line-height: inherit;
									}
								`}
							>
								{links ? (
									<Link
										to={
											'/documentation/' +
											utils.encodeRuleName(category.dottedName)
										}
									>
										{bar}
									</Link>
								) : (
									bar
								)}
							</motion.li>
						)
					})}
				</ul>
			</div>
			{showBudget && (
				<span css=" background: yellow ;">
					Budget climat 1 journée {transportClimateBudget.toFixed(1)} kg
				</span>
			)}
		</section>
	)
}
