'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { sortGares } from './gares'

import MapButtons from '@/components/MapButtons'
import { goodIconSize } from '@/components/mapUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useAddMap from './effects/useAddMap'
import useDrawQuickSearchFeatures from './effects/useDrawQuickSearchFeatures'
import { getStyle } from './styles/styles'
import useHoverOnMapFeatures from './useHoverOnMapFeatures'
import useTerrainControl from './useTerrainControl'

import { useDimensions } from '@/components/react-modal-sheet/hooks'
import getBbox from '@turf/bbox'
import { useLocalStorage, useMediaQuery } from 'usehooks-ts'
import CenteredCross from './CenteredCross'
import MapComponents from './MapComponents'
import { snapPoints } from './ModalSheet'
import { defaultState } from './defaultState'
import useDrawElectionClusterResults from './effects/useDrawElectionCluserResults'
import useDrawSearchResults from './effects/useDrawSearchResults'
import useDrawTransport from './effects/useDrawTransport'
import useImageSearch from './effects/useImageSearch'
import useMapClick from './effects/useMapClick'
import useRightClick from './effects/useRightClick'
import useSearchLocalTransit from './effects/useSearchLocalTransit'
import useDrawItinerary from './itinerary/useDrawItinerary'
import MapCompassArrow from './boussole/MapCompassArrow'

if (process.env.NEXT_PUBLIC_MAPTILER == null) {
	throw new Error('You have to configure env NEXT_PUBLIC_MAPTILER, see README')
}

/*******
 * This component should hold only the hooks that depend on the map or are user
 * interactions. Components that can be rendered server side to make beautiful and useful meta previews of URLs must be written in the Container component or above
 *******/

export default function Map({
	searchParams,
	state,
	vers,
	target,
	zoom,
	osmFeature,
	isTransportsMode,
	transportStopData,
	transportsData,
	clickedStopData,
	itinerary,
	bikeRouteProfile,
	showOpenOnly,
	category,
	bbox,
	setBbox,
	gares,
	clickGare,
	clickedGare,
	setBboxImages,
	focusImage,
	styleKey,
	safeStyleKey,
	setSafeStyleKey,
	styleChooser,
	setStyleChooser,
	setZoom,
	setGeolocation,
	setTempStyle,
	center,
	setState,
	setLatLngClicked,
	quickSearchFeatures,
	trackedSnap,
}) {
	const isMobile = useMediaQuery('(max-width: 800px)')
	const mapContainerRef = useRef(null)
	const [autoPitchPreference, setAutoPitchPreference] = useLocalStorage(
		'autoPitchPreference',
		null
	)
	const autoPitchPreferenceIsNo = autoPitchPreference === 'no'

	const style = useMemo(() => getStyle(styleKey), [styleKey]),
		styleUrl = style.url

	const [map, triggerGeolocation] = useAddMap(
		styleUrl,
		setZoom,
		setBbox,
		mapContainerRef,
		setGeolocation
	)
	const setSearchParams = useSetSearchParams()

	const shouldGeolocate = searchParams.geoloc
	useEffect(() => {
		if (!map || !shouldGeolocate) return
		console.log('will trigger maplibregeolocate')
		triggerGeolocation()
		setSearchParams({ geoloc: undefined })
	}, [map, triggerGeolocation, shouldGeolocate, setSearchParams])

	const [distanceMode, setDistanceMode] = useState(false)

	useEffect(() => {
		if (!transportStopData.length) return

		setTempStyle('light')

		return () => {
			console.log('will unset')
			setTempStyle(null)
		}
	}, [setTempStyle, transportStopData])

	const { height } = useDimensions()

	const sideSheetProbablySmall = !isMobile && !Object.keys(searchParams).length
	useEffect(() => {
		if (!map) return

		if (isMobile) {
			const snapValue = snapPoints[trackedSnap],
				bottom =
					snapValue < 0
						? height + snapValue
						: snapValue < 1
						? height * snapValue
						: snapValue
			map.flyTo({ padding: { bottom } })
		} else {
			map.flyTo({
				padding: {
					left: sideSheetProbablySmall ? 0 : 400, //  rough estimate of the footprint in pixel of the left sheet on desktop; should be made dynamic if it ever gets resizable (a good idea)
				},
			})
		}
	}, [map, isMobile, trackedSnap, sideSheetProbablySmall])

	useImageSearch(
		map,
		setBboxImages,
		zoom,
		bbox,
		searchParams.photos === 'oui',
		focusImage
	)

	// TODO reactivate
	useSearchLocalTransit(map, isTransportsMode, center, zoom)

	const agencyId = searchParams.agence
	const agency = useMemo(() => {
		const agencyData =
			transportsData && transportsData.find((el) => el[0] === agencyId)
		return agencyData && { id: agencyData[0], ...agencyData[1] }
	}, [agencyId]) // including transportsData provokes a loop : maplibre bbox updated -> transportsData recreated -> etc
	useEffect(() => {
		if (!map || !agency) return

		const bbox = agency.bbox

		const mapLibreBBox = [
			[bbox[2], bbox[1]],
			[bbox[0], bbox[3]],
		]
		map.fitBounds(mapLibreBBox)
	}, [map, agency])

	console.log('ploup', styleKey, safeStyleKey)
	useDrawElectionClusterResults(map, styleKey, searchParams.filtre)

	useDrawTransport(
		map,
		clickedStopData[1]?.features,
		safeStyleKey,
		clickedStopData[0]
	)

	useDrawItinerary(
		map,
		itinerary.isItineraryMode,
		searchParams,
		state,
		zoom,
		itinerary.routes,
		itinerary.date
	)

	const onSearchResultClick = (feature) => {
		setState([...state.slice(0, -1), defaultState.vers])
		//setOsmFeature(feature) old function, this call seems useless now
	}

	//TODO this hook should be used easily with some tweaks to draw the borders of
	// the clicked feature, and an icon
	// Edit : we draw contours now, for the search results clicked feature

	useDrawQuickSearchFeatures(
		map,
		quickSearchFeatures,
		showOpenOnly,
		category,
		onSearchResultClick
	)
	useDrawSearchResults(map, state, onSearchResultClick)

	useTerrainControl(map, style)

	useEffect(() => {
		if (!map) return
		map.on('zoom', () => {
			const approximativeZoom = Math.round(map.getZoom())
			if (approximativeZoom !== zoom) setZoom(approximativeZoom)
		})
		map.on('moveend', () => {
			setBbox(map.getBounds().toArray())
		})
	}, [zoom, setZoom, map, setBbox])

	const prevStyleKeyRef = useRef()
	useEffect(() => {
		prevStyleKeyRef.current = styleKey
	}, [styleKey])

	const prevStyleKey = prevStyleKeyRef.current
	useEffect(() => {
		if (!map) return
		if (styleKey === prevStyleKey) return

		console.log('salut redraw')

		// diff seems to fail because of a undefined sprite error showed in the
		// console
		// hence this diff: false. We're not loosing much
		// UPDATE 26 april 2024, maplibre 4.1.3, seems to be working now, hence
		// diff: true :)
		map.setStyle(styleUrl, { diff: true }) //setting styleKey!== 'base' doesn't work, probably because the error comes from switching from base to another ?
		setTimeout(() => {
			// Hack : I haven't found a way to know when this style change is done, hence this setTimeout, absolutely not a UI problem but could be too quick ?
			setSafeStyleKey(styleKey)
		}, 300)
	}, [styleUrl, map, styleKey, prevStyleKey, setSafeStyleKey])

	useRightClick(map)

	useMapClick(
		map,
		state,
		distanceMode,
		itinerary,
		isTransportsMode,
		setLatLngClicked,
		setState,
		gares,
		clickGare,
		setSearchParams
	)

	useHoverOnMapFeatures(map)

	/*
	 *
	 * Fly to hook
	 *
	 * */
	useEffect(() => {
		if (!map || !vers || !osmFeature) return
		if (state.filter((step) => step?.key).length > 1) return

		const tailoredZoom = //TODO should be defined by the feature's polygon if any
			/* ['city'].includes(vers.choice.type)
			? 12
			: */
			Math.max(15, zoom)
		console.log(
			'blue',
			'will fly to in after OSM download from vers marker',
			vers,
			tailoredZoom
		)
		if (osmFeature.polygon) {
			const bbox = getBbox(osmFeature.polygon)
			map.fitBounds(bbox, {
				maxZoom: 17.5, // We don't want to zoom at door level for a place, just at street level
			})
		} else {
			if (!autoPitchPreferenceIsNo)
				setAutoPitchPreference(Math.round(new Date().getTime() / 1000))
			const auto3d = !autoPitchPreferenceIsNo
			map.flyTo({
				center: [vers.longitude, vers.latitude],
				zoom: tailoredZoom,
				pitch: autoPitchPreferenceIsNo ? 0 : 40, // pitch in degrees
				bearing: autoPitchPreferenceIsNo ? 0 : 15, // bearing in degrees
				// speed and maxDuration could let us zoom less quickly between shops,
				// but then the animation from town to town wouldn't take place anymore.
				// This animation lets the user understand the direction of the move.
			})
		}
	}, [
		map,
		vers,
		osmFeature,
		state,
		autoPitchPreferenceIsNo,
		setAutoPitchPreference,
	])

	/* TODO Transform this to handle the last itinery point if alone (just a POI url),
	 * but also to add markers to all the steps of the itinerary */
	/* Should be merged with the creation of route markers
	useSetTargetMarkerAndZoom(
		map,
		target,
		state.vers.marker,
		state.vers.choice.type,
		setState,
		setLatLngClicked,
		zoom
	)
	*/

	/* Abandoned code that should be revived. Traveling with train + bike is an
	 * essential objective of Cartes */
	const lesGaresProches =
		target && gares && sortGares(gares, target).slice(0, 30)

	useEffect(() => {
		if (!lesGaresProches) return
		const markers = lesGaresProches.map((gare) => {
			const element = document.createElement('div')
			const factor = { 1: 0.9, 2: 1.1, 3: 1.3 }[gare.niveau] || 0.7
			element.style.cssText = `
				display: flex;
				flex-direction: column;
				align-items: center;
				cursor: help;
			`
			const size = goodIconSize(zoom, factor) + 'px'

			const image = document.createElement('img')
			image.src = '/gare.svg'
			image.style.width = size
			image.style.height = size
			image.alt = "Icône d'une gare"
			element.append(image)

			element.addEventListener('click', () => {
				clickGare(gare.uic === clickedGare?.uic ? null : gare.uic)
			})

			const marker = new maplibregl.Marker({ element })
				.setLngLat(gare.coordonnées)
				.addTo(map)
			return marker
		})
		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [lesGaresProches, map, zoom, clickGare, clickedGare?.uic])

	return (
		<>
			<MapButtons
				{...{
					style,
					setStyleChooser,
					styleChooser,
					distanceMode,
					setDistanceMode,
					map,
					itinerary,
					searchParams,
				}}
			/>
			{isTransportsMode && <CenteredCross />}
			<MapCompassArrow />
			{map && (
				<MapComponents
					{...{
						map,
						vers,
						transportsData,
						setTempStyle,
						isTransportsMode,
						safeStyleKey,
						searchParams,
					}}
				/>
			)}
			<div
				ref={mapContainerRef}
				css={`
					.maplibregl-ctrl
						button.maplibregl-ctrl-compass
						.maplibregl-ctrl-icon {
						background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='crimson' viewBox='0 0 29 29'%3E%3Cpath d='m10.5 14 4-8 4 8z'/%3E%3Cpath fill='%23ccc' d='m10.5 16 4 8 4-8z'/%3E%3C/svg%3E");
					}
				`}
			/>
		</>
	)
}
