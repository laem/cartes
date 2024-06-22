'use client'

/**
 * This component is a client component to hold state but does
 * not require the maplibre instance
 *
 * Depends on what we want :
 * - make our servers work and serve a finished content page to the user and
 * google's pagespeed
 * - let requests be done by the user browser and start loading the map more
 * quickly
 *
 * Note : some requests will be made on the server to generate metadata, doing
 * them again client side is a bit of a waste (not totally, because data has to
 * be transmitted to the user anyway ; it's data vs code)
 *
 * If the server path is chosen, useStates become fetch. Some useStates can't be
 * server side, because used by client components that need the map e.g. for the
 * bbox
 **/

import { useMemo, useRef, useState } from 'react'

import { getCategory } from 'Components/voyage/categories'
import ModalSwitch from './ModalSwitch'
import { ContentWrapper, MapContainer } from './UI'
import { useZoneImages } from './ZoneImages'
import useSetItineraryModeFromUrl from './itinerary/useSetItineraryModeFromUrl'

import useSetSearchParams from 'Components/useSetSearchParams'
import dynamic from 'next/dynamic'
import FocusedImage from './FocusedImage'
import { defaultZoom } from './effects/useAddMap'
import useFetchTransportMap from './effects/useFetchTransportMap'
import useOsmRequest from './effects/useOsmRequest'
import useFetchItinerary from './itinerary/useFetchItinerary'
import Meteo from './meteo/Meteo'
import { getStyle } from './styles/styles'
import useTransportStopData from './transport/useTransportStopData'
import useGeocodeRightClick from './effects/useGeocodeRightClick'
import useOverpassRequest from './effects/useOverpassRequest'
// Map is forced as dynamic since it can't be rendered by nextjs server-side.
// There is almost no interest to do that anyway, except image screenshots
const Map = dynamic(() => import('./Map'), {
	ssr: false,
})

export default function Container({ searchParams }) {
	const setSearchParams = useSetSearchParams()
	const [focusedImage, focusImage] = useState(null)
	const [bbox, setBbox] = useState(null)
	const [zoom, setZoom] = useState(defaultZoom)
	const [bboxImages, setBboxImages] = useState([])
	const [latLngClicked, setLatLngClicked] = useState(null)
	const resetClickedPoint = () => setSearchParams({ clic: undefined })

	const geocodedClickedPoint = useGeocodeRightClick(searchParams.clic)

	const [geolocation, setGeolocation] = useState(null)

	const [safeStyleKey, setSafeStyleKey] = useState(null)
	const [tempStyle, setTempStyle] = useState(null)
	const styleKey = tempStyle || searchParams.style || 'base'
	const style = getStyle(styleKey)

	const styleChooser = searchParams['choix du style'] === 'oui',
		setStyleChooser = (state) =>
			setSearchParams({ 'choix du style': state ? 'oui' : undefined })

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

	// TODO This could be a simple derived variable but we seem to be using it in a
	// button down below, not sure if it's relevant, why not wait for the url to
	// change ?
	const [isItineraryMode, setIsItineraryMode] = useState(false)

	// TODO this hook must be split between useFetchItineraryData and
	// useDrawItinerary like useTransportMap was
	const [resetItinerary, routes, date] = useFetchItinerary(
		searchParams,
		state,
		bikeRouteProfile
	)

	const itinerary = {
		bikeRouteProfile,
		isItineraryMode,
		setIsItineraryMode,
		reset: resetItinerary,
		routes,
		date,
	}

	useSetItineraryModeFromUrl(allez, setIsItineraryMode)

	const category = getCategory(searchParams)

	const showOpenOnly = searchParams.o

	const [zoneImages, panoramaxImages, resetZoneImages] = useZoneImages({
		latLngClicked,
		setLatLngClicked,
	})

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

	const isTransportsMode = searchParams.transports === 'oui'

	const transportsData = useFetchTransportMap(
		isTransportsMode,
		searchParams.day,
		bbox,
		searchParams.agence,
		searchParams.noCache
	)

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

	/* The bbox could be computed from the URL hash, for this to run on the
	 * server but I'm not sure we want it, and I'm not sure Next can get the hash
	 * server-side, it's a client-side html element */
	const simpleArrayBbox = useMemo(() => {
		if (!bbox) return
		return [bbox[0][1], bbox[0][0], bbox[1][1], bbox[1][0]]
	}, [bbox])

	const [quickSearchFeatures] = useOverpassRequest(simpleArrayBbox, category)
	const quickSearchFeaturesLoaded =
		quickSearchFeatures &&
		category &&
		(quickSearchFeatures.length === 0 ||
			quickSearchFeatures[0]?.categoryName === category.name)

	const containerRef = useRef()
	return (
		<div ref={containerRef}>
			<MapContainer>
				<ContentWrapper>
					<ModalSwitch
						{...{
							setState,
							state,
							clickedGare,
							clickGare,
							//bikeRoute,
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
							geocodedClickedPoint,
							resetClickedPoint,
							transportsData,
							geolocation,
							bboxImages,
							bbox,
							focusImage,
							vers,
							osmFeature,
							quickSearchFeaturesLoaded,
							containerRef,
						}}
					/>
				</ContentWrapper>
				<Meteo coordinates={center} />
				{focusedImage && <FocusedImage {...{ focusedImage, focusImage }} />}
				<Map
					{...{
						searchParams,
						state,
						vers,
						target,
						osmFeature,
						zoom,
						isTransportsMode,
						transportStopData,
						transportsData,
						clickedStopData,
						bikeRouteProfile,
						showOpenOnly,
						category,
						bbox,
						setBbox,
						setBboxImages,
						gares,
						clickGare,
						clickedGare,
						focusImage,
						styleKey,
						safeStyleKey,
						styleChooser,
						setStyleChooser,
						itinerary,
						geocodedClickedPoint,
						setGeolocation,
						setZoom,
						setTempStyle,
						center,
						setState,
						setLatLngClicked,
						setSafeStyleKey,
						quickSearchFeatures,
					}}
				/>
			</MapContainer>
		</div>
	)
}
