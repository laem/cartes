'use client'

import { situationSelector } from 'Selectors/simulationSelectors'

import Engine from 'publicodes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useEngine2 = (rules) => {
	const engine = useMemo(
			() => console.log('new engine') || new Engine(rules),
			[rules]
		),
		userSituation = useSelector(situationSelector),
		//		configSituation = useSelector(configSituationSelector), //unsupported in this new version where config is not stored in the state

		situation = useMemo(
			() => ({
				...userSituation,
			}),
			[userSituation]
		)
	engine.setSituation(situation)

	return engine
}
