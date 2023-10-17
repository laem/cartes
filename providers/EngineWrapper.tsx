'use client'

import { situationSelector } from 'Selectors/simulationSelectors'

import Engine from 'publicodes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useEngine2 = (rules, baseSituation) => {
	const engine = useMemo(
			() => console.log('new engine') || new Engine(rules),
			[rules]
		),
		userSituation = useSelector(situationSelector),
		situation = useMemo(
			() => ({
				...baseSituation,
				...userSituation,
			}),
			[baseSituation, userSituation]
		)
	engine.setSituation(situation)

	return engine
}
