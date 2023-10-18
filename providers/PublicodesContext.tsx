'use client'

import React, { useContext, useMemo, useState } from 'react'

import rules from '@/app/voyage/cout-voiture/data/rules'
import { situationSelector } from '@/selectors/simulationSelectors'
import Engine from 'publicodes'
import { useSelector } from 'react-redux'

const PublicodesContext = React.createContext()

export default function PublicodesProvider({ children }) {
	const [request, requestPublicodes] = useState(null)
	const engine = useMemo(() => {
		if (request != null) {
			console.log(
				'⚠️ Engine requested by a client component, will parse Rules (expensive operation)'
			)
			const engine = new Engine(rules)
			return engine
		}
		return
	}, [request])

	const situation = useSelector(situationSelector(request.objective))
	const exemple = useSelector((state) => state.exemple),
		exempleSituation = exemple?.situation || {}
	const updatedEngine = useMemo(() => {
		if (!engine) return

		console.log('will set situation', situation, exempleSituation)
		return engine.setSituation({ ...situation, ...exempleSituation })
	}, [situation, engine, exempleSituation])

	return (
		<PublicodesContext.Provider value={[requestPublicodes, updatedEngine]}>
			{children}
		</PublicodesContext.Provider>
	)
}

/**
 *
 * @returns The survey definition WITHOUT REACT COMPONENTS
 */
export const usePublicodes = () => {
	const context = useContext(PublicodesContext)
	if (!context) {
		throw new Error(
			'Called usePublicodes before setting PublicodesProvider context'
		)
	}
	return context
}
