'use client'

import { setSimulationConfig } from '@/actions'
import { questionEcoDimensions } from 'Components/questionEcoDimensions'
import { parentName } from 'Components/utils/publicodesUtils'
import { usePathname } from 'next/navigation'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import configBuilder from './configBuilder'
import SimulateurContent from './SimulateurContent'

const eqValues = compose(isEmpty, symmetricDifference)

export default ({ dottedName }) => {
	const dispatch = useDispatch()
	const pathname = usePathname()

	const rules = useSelector((state) => state.rules)

	if (!rules) return 'Les règles ne sont pas chargées'
	const decodedRule = rules[dottedName]

	if (!decodedRule) return 'Règle non trouvée'
	const objectifs =
		decodedRule.exposé?.type === 'question éco'
			? questionEcoDimensions.map(
					(dimension) => parentName(dottedName) + ' . ' + dimension
			  )
			: [dottedName]

	const config = configBuilder(objectifs, dottedName),
		configSet = useSelector((state) => state.simulation?.config)
	const wrongConfig = !eqValues(config.objectifs, configSet?.objectifs || [])
	useEffect(
		() =>
			wrongConfig
				? dispatch(setSimulationConfig(config, pathname))
				: () => null,
		[]
	)

	if (!configSet || wrongConfig) return null

	return <SimulateurContent objective={dottedName} />
}
