import { setSimulationConfig } from 'Actions/actions'
import IllustratedButton from 'Components/IllustratedButton'
import { extractCategories, splitName } from 'Components/publicodesUtils'
import SessionBar from 'Components/SessionBar'
import { EngineContext } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { partition, sortBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { correctValue } from '../../components/publicodesUtils'
import { sessionBarMargin } from '../../components/SessionBar'
import {
	answeredQuestionsSelector,
	configSelector,
} from '../../selectors/simulationSelectors'
import ActionStack from './ActionStack'
import ActionVignette, { disabledAction } from './ActionVignette'
import CategoryFilters from './CategoryFilters'

const { encodeRuleName, decodeRuleName } = utils

export default ({}) => {
	const location = useLocation()
	let { category } = useParams()

	const rules = useSelector((state) => state.rules)
	const flatActions = rules['actions']

	const radical = true

	const simulation = useSelector((state) => state.simulation)

	// Add the actions rules to the simulation, keeping the user's situation
	const config = {
		...(simulation?.config || {}),
		objectifs: ['bilan', ...flatActions.formule.somme],
	}

	const objectifs = useSelector(objectifsSelector)

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const stateConfig = useSelector(configSelector),
		configSet = stateConfig && Object.keys(stateConfig).length
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const mode = useSelector((state) => state.actionMode)

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [location.pathname])
	if (!configSet) return <div>Config not set</div>

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const sortedActionsByImpact = sortBy(
			(a) => (radical ? 1 : -1) * correctValue(a)
		)(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			return !disabledAction(flatRule, action.nodeValue)
		})

	const finalActions = filterByCategory(interestingActions)

	const categories = extractCategories(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	return (
		<div
			css={`
				padding: 0 0.3rem 1rem;
				max-width: 600px;
				margin: 1rem auto;

				${sessionBarMargin}
			`}
		>
			<SessionBar />
			{finalActions.length ? (
				<ActionStack
					key={category}
					actions={finalActions}
					onVote={(item, vote) => console.log(item.props, vote)}
				>
					{finalActions.map((evaluation) => (
						<Item
							className="plop"
							data-value={evaluation.dottedName}
							whileTap={{ scale: 1.15 }}
						>
							<ActionVignette
								key={evaluation.dottedName}
								rule={rules[evaluation.dottedName]}
								evaluation={evaluation}
								total={bilans.length ? bilans[0].nodeValue : null}
							/>
						</Item>
					))}
				</ActionStack>
			) : (
				<p>{emoji('🤷')} Plus d'actions dans cette catégorie</p>
			)}

			<CategoryFilters
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>
		</div>
	)
}

const Item = styled(motion.div)`
	width: 16rem;
	height: 21rem;
	@media (max-width: 800px) {
		width: 13rem;
		height: 18rem;
	}

	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	padding: 1rem 0.4rem;
	transform: ${() => {
		let rotation = Math.random() * (5 - -5) + -5
		return `rotate(${rotation}deg)`
	}};
`
