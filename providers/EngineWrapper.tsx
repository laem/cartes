'use client'

import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'

import Engine from 'publicodes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useEngine2 = () => {
	const rules = useSelector((state) => state.rules)

	const engine = useMemo(() => new Engine(rules), [rules]),
		userSituation = useSelector(situationSelector),
		configSituation = useSelector(configSituationSelector),
		situation = useMemo(
			() => ({
				...configSituation,
				...userSituation,
			}),
			[configSituation, userSituation]
		)

	return engine
}
