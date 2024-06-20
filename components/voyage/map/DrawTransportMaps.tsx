import useDrawTransport from '@/app/voyage/effects/useDrawTransport'
import { gtfsServerUrl } from '@/app/voyage/serverUrls'
import { defaultTransitFilter } from '@/app/voyage/transport/TransitFilter'
import { filterTransportFeatures } from '@/app/voyage/transport/filterTransportFeatures'
import { sortBy } from '@/components/utils/utils'
import { useEffect, useMemo, useState } from 'react'

export default function DrawTransportMaps({
	map,
	transportsData,
	setTempStyle,
	styleKey,
	searchParams,
}) {
	useEffect(() => {
		setTempStyle('light')
		return () => {
			setTempStyle(null)
		}
	}, [setTempStyle])

	const {
		routes: routesParam,
		'type de train': trainType,
		filtre: transitFilter = defaultTransitFilter,
		arret: stop,
		agence: selectedAgency,
	} = searchParams

	const [selectedAgencyBbox, setSelectedAgencyBbox] = useState(null)

	useEffect(() => {
		if (!map) return
		if (!selectedAgencyBbox) return
		const bbox = selectedAgencyBbox

		map.fitBounds(
			[
				[bbox[0], bbox[1]],
				[bbox[2], bbox[3]],
			],

			{
				padding: { top: 50, bottom: 50, left: 100, right: 100 },
				duration: 600,
			}
		)
	}, [selectedAgencyBbox, map])

	useEffect(() => {
		if (!selectedAgency) return

		if (selectedAgencyBbox) return
		if (transportsData?.find(([agencyId]) => agencyId === selectedAgency))
			return

		const doFetch = async () => {
			try {
				const request = await fetch(
					gtfsServerUrl + '/agencyBbox/' + selectedAgency
				)
				const json = await request.json()
				setSelectedAgencyBbox(json)
			} catch (e) {
				console.error('Error fetching agency bbox')
			}
		}
		doFetch()
	}, [selectedAgency, transportsData, selectedAgencyBbox])

	const agencyIdsHash = sortBy((id) => id)(
		transportsData.map(([id]) => id)
	).join('')

	const dataToDraw = useMemo(() => {
		console.log('memo transport dataToDraw', agencyIdsHash, transportsData)
		return transportsData
			.map(([agencyId, { features }]) => {
				if (selectedAgency != null && agencyId !== selectedAgency) return false
				const filteredFeatures = filterTransportFeatures(features, {
					routesParam,
					stop,
					trainType,
					transitFilter,
				})
				return [agencyId, filteredFeatures]
			})
			.filter(Boolean)
	}, [
		agencyIdsHash,
		routesParam,
		stop,
		trainType,
		transitFilter,
		selectedAgency,
	])

	if (styleKey !== 'light') return null

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
	console.log('transportmap draw or redraw ', agencyId, features.length)
	useDrawTransport(map, features, 'transitMap-agency-' + agencyId)
	return null
}
