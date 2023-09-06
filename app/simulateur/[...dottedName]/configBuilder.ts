import { setSimulationConfig } from '@/actions'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const configBuilder = (objectifs, decoded) => ({
	objectifs,
	questions: {
		'non prioritaires':
			decoded === 'transport . avion . impact'
				? ['transport . avion . forçage radiatif']
				: null,
		prioritaires:
			decoded === 'transport . ferry . empreinte du voyage'
				? ['transport . ferry . distance aller . orthodromique']
				: null,
	},
})
export default configBuilder

export const eqValues = (a, b) => JSON.stringify(a) === JSON.stringify(b) // arrays are very small, we don't care about perf here

export const useSimulationConfig = (rules, dottedName) => {
	const pathname = usePathname()
	const dispatch = useDispatch()
	const decodedRule = rules[dottedName]

	if (!decodedRule) return 'Règle non trouvée'
	const objectifs = [dottedName]

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
	return configSet
}
