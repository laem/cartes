'use client'

/* Server rendered client components here */

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPolygon, createSearchBBox } from './createSearchPolygon'
import { sortGares } from './gares'

import useSetSearchParams from '@/components/useSetSearchParams'
import MapButtons from '@/components/voyage/MapButtons'
import { getCategory } from '@/components/voyage/categories'
import { goodIconSize } from '@/components/voyage/mapUtils'
import ModalSwitch from './ModalSwitch'
import { ContentWrapper, MapContainer, MapHeader } from './UI'
import { useZoneImages } from './ZoneImages'
import useAddMap, { defaultZoom } from './effects/useAddMap'
import useDrawQuickSearchFeatures from './effects/useDrawQuickSearchFeatures'
import useImageSearch from './effects/useImageSearch'
import useItinerary from './itinerary/useItinerary'
import useItineraryFromUrl from './itinerary/useItineraryFromUrl'
import { disambiguateWayRelation } from './osmRequest'
import { styles } from './styles/styles'
import useHoverOnMapFeatures from './useHoverOnMapFeatures'
import useTerrainControl from './useTerrainControl'
import { encodePlace, fitBoundsConsideringModal } from './utils'

import { replaceArrayIndex } from '@/components/utils/utils'
import getBbox from '@turf/bbox'
import { useMediaQuery } from 'usehooks-ts'
import CenteredCross from './CenteredCross'
import FocusedImage from './FocusedImage'
import MapComponents from './MapComponents'
import { buildAllezPart } from './SetDestination'
import { clickableClasses } from './clickableLayers'
import useDrawSearchResults from './effects/useDrawSearchResults'
import useDrawTransport from './effects/useDrawTransport'
import useFetchTransportMap from './effects/useFetchTransportMap'
import useOsmRequest from './effects/useOsmRequest'
import useOverpassRequest from './effects/useOverpassRequest'
import useRightClick from './effects/useRightClick'
import useSearchLocalTransit from './effects/useSearchLocalTransit'
import Meteo from './meteo/Meteo'
import { defaultTransitFilter } from './transport/TransitFilter'
import useTransportStopData from './transport/useTransportStopData'
import { defaultState } from './page'
import dynamic from 'next/dynamic'
import { MapContainer } from './UI'
// Map is forced as dynamic since it can't be rendered by nextjs server-side.
// There is almost no interest to do that anyway, except image screenshots
const Map = dynamic(() => import('./Map'), {
	ssr: false,
})

export const defaultState = {
	depuis: { inputValue: null, choice: false },
	vers: { inputValue: null, choice: false },
	validated: false,
}

export default function Container({ searchParams }) {
	const isMobile = useMediaQuery('(max-width: 800px)')
	const [focusedImage, focusImage] = useState(null)
	const [bbox, setBbox] = useState(null)
	const center = useMemo(
		() =>
			bbox && [(bbox[0][0] + bbox[1][0]) / 2, (bbox[0][1] + bbox[1][1]) / 2],
		[bbox]
	)
	// In this query param is stored an array of points. If only one, it's just a
	// place focused on.
	const [state, setState] = useState([])

	const allez = useMemo(() => {
		return searchParams.allez ? searchParams.allez.split('->') : []
	}, [searchParams.allez])

	const [bikeRouteProfile, setBikeRouteProfile] = useState('safety')

	const [itineraryMode, setItineraryMode] = useState(false)
	useItineraryFromUrl(allez, setItineraryMode, map)

	const category = getCategory(searchParams)

	const showOpenOnly = searchParams.o

	const [zoneImages, panoramaxImages, resetZoneImages] = useZoneImages({
		latLngClicked,
		setLatLngClicked,
	})

	const bboxImages = useImageSearch(
		map,
		zoom,
		bbox,
		searchParams.photos === 'oui',
		focusImage
	)
	const vers = useMemo(() => state?.slice(-1)[0], [state])
	const choice = vers && vers.choice
	const target = useMemo(
		() => choice && [choice.longitude, choice.latitude],
		[choice]
	)

	useOsmRequest(allez, state, setState)

	const osmFeature = vers?.osmFeature

	const transportStopData = useTransportStopData(osmFeature)
	const clickedStopData = transportStopData[0] || []

	const transportsData = useFetchTransportMap(
		isTransportsMode,
		searchParams.day,
		bbox,
		searchParams.agence,
		searchParams.noCache
	)

	const agencyId = searchParams.agence
	const agency = useMemo(() => {
		const agencyData =
			transportsData && transportsData.find((el) => el[0] === agencyId)
		return agencyData && { id: agencyData[0], ...agencyData[1] }
	}, [agencyId]) // including transportsData provokes a loop : maplibre bbox updated -> transportsData recreated -> etc

	// TODO reintroduce gare display through the transport style option + the bike
	// mode below
	const gares = []

	const clickedGare = null
	const clickGare = (uic) => null // TODO train station + itinerary to be implemented again // setSearchParams({ gare: uic })

	/* TODO reintroduce this very cool mode
	const [bikeRoute, setBikeRoute] = useState(null)
	useEffect(() => {
		if (!target || !clickedGare) return

		const [lon1, lat1] = clickedGare.coordonnées,
			[lon2, lat2] = target

		async function fetchBikeRoute() {
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lon1},${lat1}|${lon2},${lat2}&profile=${bikeRouteProfile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			setBikeRoute(json)
		}

		fetchBikeRoute()
	}, [target, clickedGare, bikeRouteProfile])
	*/
	return (
		<main id="voyage" style={{ height: '100%' }}>
			<MapContainer>
				<ContentWrapper>
					<ModalSwitch
						{...{
							setState,
							state,
							clickedGare,
							clickGare,
							bikeRoute,
							latLngClicked,
							setLatLngClicked,
							setBikeRouteProfile,
							bikeRouteProfile,
							zoneImages,
							panoramaxImages,
							resetZoneImages,
							zoom,
							searchParams,
							style,
							styleChooser,
							setStyleChooser,
							itinerary,
							transportStopData: clickedStopData[1],
							clickedPoint,
							resetClickedPoint,
							transportsData,
							geolocation,
							triggerGeolocation,
							bboxImages,
							focusImage,
							vers,
							osmFeature,
						}}
					/>
				</ContentWrapper>
				<Meteo coordinates={center} />
				{focusedImage && <FocusedImage {...{ focusedImage, focusImage }} />}
				<Map searchParams={searchParams} />
			</MapContainer>
		</main>
	)
}

export default Page
