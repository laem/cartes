'use client'

import React, { useContext, useMemo, useState } from 'react'

import rules from '@/app/voyage/data/rules'
import Engine from 'publicodes'

const PublicodesContext = React.createContext()

export default function PublicodesProvider({ children }) {
	const [request, requestPublicodes] = useState(null)
	const engine = useMemo(() => {
		if (request != null) {
			console.log(
				'Engine requested by a client component, will parse Rules (expensive operation)'
			)
			const engine = new Engine(rules)
			return engine
		}
		return
	}, [request])

	return (
		<PublicodesContext.Provider value={[requestPublicodes, engine]}>
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
