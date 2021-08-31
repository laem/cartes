import { setSimulationConfig } from 'Actions/actions'
import { splitName } from 'Components/publicodesUtils'
import Simulation from 'Components/Simulation'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { utils } from 'publicodes'
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { parentName } from '../../components/publicodesUtils'
import { EngineContext } from '../../components/utils/EngineContext'

const { decodeRuleName, encodeRuleName } = utils

export default ({ dottedName }) => {
	const rules = useSelector((state) => state.rules)
	const nextQuestions = useNextQuestions()
	const configSet = useSelector((state) => state.simulation?.config)

	// TODO here we need to apply a rustine to accommodate for this issue
	// https://github.com/betagouv/mon-entreprise/issues/1316#issuecomment-758833973
	// to be continued...
	const actionParent = parentName(dottedName)
	const config = {
		objectifs: [dottedName],
		situation: { ...(configSet?.situation || {}) },
	}

	const engine = useContext(EngineContext)

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [dottedName])
	if (!configSet) return null

	const evaluation = engine.evaluate(dottedName),
		{ nodeValue, title } = evaluation

	const { description, icônes: icons, plus } = rules[dottedName]
	console.log('EVAL', plus)

	const flatActions = rules['actions']
	const relatedActions = flatActions.formule.somme
		.filter(
			(actionDottedName) =>
				actionDottedName !== dottedName &&
				splitName(dottedName)[0] === splitName(actionDottedName)[0]
		)
		.map((name) => engine.getRule(name))

	return nextQuestions.length > 0 ? (
		<Simulation
			noFeedback
			showConversation
			customEnd={<div />}
			targets={<div />}
			explanations={null}
		/>
	) : null
}
