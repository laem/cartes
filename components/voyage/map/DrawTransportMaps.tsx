import useDrawTransport from '@/app/voyage/effects/useDrawTransport'
import { defaultTransitFilter } from '@/app/voyage/transport/TransitFilter'
import { filterTransportFeatures } from '@/app/voyage/transport/filterTransportFeatures'
import { sortBy } from '@/components/utils/utils'
import { useEffect, useMemo } from 'react'

export default function DrawTransportMaps({
	map,
	transportsData,
	setTempStyle,
	styleKey,
	searchParams,
}) {
	useEffect(() => {
		setTempStyle('transit')
		return () => {
			setTempStyle(null)
		}
	}, [setTempStyle])

	const {
		routes: routesParam,
		'type de train': trainType,
		filtre: transitFilter = defaultTransitFilter,
		arret: stop,
	} = searchParams

	const agencyIdsHash = sortBy((id) => id)(
		transportsData.map(([id]) => id)
	).join('')

	const dataToDraw = useMemo(() => {
		console.log('memo transport dataToDraw', agencyIdsHash, transportsData)
		return transportsData.map(([agencyId, { features }]) => {
			const filteredFeatures = filterTransportFeatures(features, {
				routesParam,
				stop,
				trainType,
				transitFilter,
			})
			return [agencyId, filteredFeatures]
		})
	}, [agencyIdsHash, routesParam, stop, trainType, transitFilter])

	if (styleKey !== 'transit') return null

	return dataToDraw.map(([agencyId, features]) => (
		<DrawTransportMap
			key={agencyId}
			agencyId={agencyId}
			features={features}
			map={map}
		/>
	))
}

const DrawTransportMap = ({ map, agencyId, features }) => {
	useDrawTransport(map, features, 'transitMap-agency-' + agencyId)
	return null
}
