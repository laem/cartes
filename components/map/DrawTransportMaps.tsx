import useDrawTransport from '@/app/effects/useDrawTransport'
import useDrawTransportAreas from '@/app/effects/useDrawTransportAreas'
import { gtfsServerUrl } from '@/app/serverUrls'
import { defaultTransitFilter } from '@/app/transport/TransitFilter'
import { filterTransportFeatures } from '@/app/transport/filterTransportFeatures'
import { sortBy } from '@/components/utils/utils'
import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export default function DrawTransportMaps({
	map,
	transportsData,
	setTempStyle,
	safeStyleKey,
	searchParams,
	hasItinerary,
}) {
	// TODO if base style when F5 before activating transport mode is light style,
	// safeStyleKey won't be triggered, so nothing will be drawn
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
	const isMobile = useMediaQuery('(max-width: 800px)')

	useEffect(() => {
		if (!map) return
		if (!selectedAgencyBbox) return
		const bbox = selectedAgencyBbox

		const fitBoundsBbox = [
			[bbox[0], bbox[1]],
			[bbox[2], bbox[3]],
		]

		map.fitBounds(fitBoundsBbox)
	}, [selectedAgencyBbox, map, isMobile])

	useEffect(() => {
		if (!selectedAgency) return

		if (selectedAgencyBbox) return
		if (
			transportsData &&
			transportsData[0].find(([agencyId]) => agencyId === selectedAgency)
		)
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
		transportsData[0].map(([id]) => id)
	).join('')

	const dataToDraw = useMemo(() => {
		console.log('memo transport dataToDraw', agencyIdsHash, transportsData)
		return transportsData[0]
			.map(([agencyId, data]) => {
				const { bbox, features } = data
				console.log('orange data', data)
				if (selectedAgency != null && agencyId !== selectedAgency) return false
				const filteredFeatures = filterTransportFeatures(features, {
					routesParam,
					stop,
					trainType,
					transitFilter,
				})
				return [agencyId, filteredFeatures, bbox]
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

	if (safeStyleKey !== 'light') return null

	return (
		<>
			<DrawTransportAreas areas={transportsData[1]} map={map} />
			{dataToDraw.map(([agencyId, features, bbox]) => (
				<DrawTransportMap
					key={agencyId}
					agencyId={agencyId}
					features={features}
					map={map}
					hasItinerary={hasItinerary}
					bbox={bbox}
				/>
			))}
		</>
	)
}

const DrawTransportAreas = ({ map, areas }) => {
	useDrawTransportAreas(map, areas)
	return null
}

const DrawTransportMap = ({ map, agencyId, features, hasItinerary, bbox }) => {
	console.log(
		'lightpink transportmap draw or redraw ',
		agencyId,
		features.length
	)
	useDrawTransport(
		map,
		features,
		'transitMap-agency-' + agencyId,
		hasItinerary,
		bbox
	)
	return null
}
