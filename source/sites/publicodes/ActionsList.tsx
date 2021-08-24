import { setSimulationConfig } from 'Actions/actions'
import IllustratedButton from 'Components/IllustratedButton'
import { extractCategories, splitName } from 'Components/publicodesUtils'
import SessionBar from 'Components/SessionBar'
import { EngineContext } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { partition, sortBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
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

	const effortScale = { modéré: 2, conséquent: 3, faible: 1, undefined: 0 }
	const sortedActionsByMode =
			mode === 'guidé'
				? sortBy((a) => effortScale[rules[a.dottedName].effort])(
						actions.filter((a) => rules[a.dottedName].effort != null)
				  )
				: sortBy((a) => (radical ? -1 : 1) * correctValue(a))(actions),
		sortedActions = sortBy((action) => {
			const flatRule = rules[action.dottedName]
			return disabledAction(flatRule, action.nodeValue)
		}, sortedActionsByMode)

	const finalActions = filterByCategory(sortedActions)

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
			<div
				css={`
					text-align: center;
					display: flex;
					justify-content: center;
					align-content: center;
					height: 60vh;
					width: 100vw;
				`}
			>
				<ActionStack onVote={(item, vote) => console.log(item.props, vote)}>
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
			</div>
			<div css="font-size: 100%; text-align: center">
				<em>en CO₂e / an et proportion de votre total</em>
			</div>
			<IllustratedButton to={'/actions/plus'} icon="📚">
				<div>
					<div>Comprendre les actions</div>
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

const Item = styled(motion.div)`
	width: 200px;
	height: 250px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 80px;
	text-shadow: 0 10px 10px #d1d5db;
	box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
	border-radius: 8px;
	transform: ${() => {
		let rotation = Math.random() * (5 - -5) + -5
		return `rotate(${rotation}deg)`
	}};
`
