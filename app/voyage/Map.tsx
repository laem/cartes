'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPolygon, createSearchBBox } from './createSearchPolygon'
import { sortGares } from './gares'

import useSetSearchParams from '@/components/useSetSearchParams'
import MapButtons from '@/components/voyage/MapButtons'
import { goodIconSize } from '@/components/voyage/mapUtils'
import useAddMap, { defaultZoom } from './effects/useAddMap'
import useDrawQuickSearchFeatures from './effects/useDrawQuickSearchFeatures'
import { disambiguateWayRelation } from './osmRequest'
import { getStyle, styles } from './styles/styles'
import useHoverOnMapFeatures from './useHoverOnMapFeatures'
import useTerrainControl from './useTerrainControl'
import { encodePlace, fitBoundsConsideringModal } from './utils'

import { replaceArrayIndex } from '@/components/utils/utils'
import getBbox from '@turf/bbox'
import { useMediaQuery } from 'usehooks-ts'
import CenteredCross from './CenteredCross'
import MapComponents from './MapComponents'
import { buildAllezPart } from './SetDestination'
import { clickableClasses } from './clickableLayers'
import useDrawSearchResults from './effects/useDrawSearchResults'
import useDrawTransport from './effects/useDrawTransport'
import useOverpassRequest from './effects/useOverpassRequest'
import useRightClick from './effects/useRightClick'
import useSearchLocalTransit from './effects/useSearchLocalTransit'
import useImageSearch from './effects/useImageSearch'
import { defaultState } from './defaultState'
import useDrawItinerary from './itinerary/useDrawItinerary'
import { setLazyProp } from 'next/dist/server/api-utils'

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
}) {
	const isMobile = useMediaQuery('(max-width: 800px)')
	const mapContainerRef = useRef(null)

	const style = getStyle(styleKey),
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

	useDrawTransport(
		map,
		clickedStopData[1]?.features,
		safeStyleKey,
		clickedStopData[0]
	)

	useDrawItinerary(
		map,
		itinerary.itineraryMode,
		searchParams,
		state,
		zoom,
		itinerary.routes
	)

	const simpleArrayBbox = useMemo(() => {
		if (!map) return
		const mapLibreBbox = map.getBounds().toArray(),
			bbox = [
				mapLibreBbox[0][1],
				mapLibreBbox[0][0],
				mapLibreBbox[1][1],
				mapLibreBbox[1][0],
			]
		return bbox
	}, [map])

	/* The bbox could be computed from the URL hash, for this to run on the
	 * server but I'm not sure we want it, and I'm not sure Next can get the hash
	 * server-side, it's a client-side html element */
	const [features] = useOverpassRequest(simpleArrayBbox, category)

	const onSearchResultClick = (feature) => {
		setState([...state.slice(0, -1), defaultState.vers])
		//setOsmFeature(feature) old function, this call seems useless now
	}

	//TODO this hook should be used easily with some tweaks to draw the borders of
	// the clicked feature, and an icon
	// Edit : we draw contours now, for the search results clicked feature

	useDrawQuickSearchFeatures(
		map,
		features,
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

	// This hook lets the user click on the map to find OSM entities
	// It also draws a polygon to show the search area for pictures
	// (not obvious for the user though)
	useEffect(() => {
		if (isTransportsMode) return
		const onClick = async (e) => {
			console.log('click event', e)
			setLatLngClicked(e.lngLat)

			const source = map.getSource('searchPolygon')
			const polygon = createPolygon(createSearchBBox(e.lngLat))

			if (source) {
				source.setData(polygon.data)
				map && map.setPaintProperty('searchPolygon', 'fill-opacity', 0.6)
			} else {
				map.addSource('searchPolygon', polygon)

				map.addLayer({
					id: 'searchPolygon',
					type: 'fill',
					source: 'searchPolygon',
					layout: {},
					paint: {
						'fill-color': '#57bff5',
						'fill-opacity': 0.6,
					},
				})
			}
			setTimeout(() => {
				map && map.setPaintProperty('searchPolygon', 'fill-opacity', 0)
			}, 1000)

			const allowedLayerProps = ({ properties: { class: c }, sourceLayer }) =>
				sourceLayer === 'poi' ||
				(['place', 'waterway'].includes(sourceLayer) &&
					clickableClasses.includes(c)) // Why ? because e.g. "state" does not map to an existing OSM id in France at least, see https://github.com/openmaptiles/openmaptiles/issues/792#issuecomment-1850139297
			// TODO when "state" place, make an overpass request with name, since OMT's doc explicitely says that name comes from OSM

			// Thanks OSMAPP https://github.com/openmaptiles/openmaptiles/issues/792
			const rawFeatures = map.queryRenderedFeatures(e.point),
				features = rawFeatures.filter(
					(f) => f.source === 'maptiler_planet' && allowedLayerProps(f)
				)

			console.log('clicked map features', rawFeatures)

			if (!features.length || !features[0].id) {
				console.log('no features', features)
				return
			}

			const feature = features[0]
			const openMapTilesId = '' + feature.id

			// For "Vitré", a town, I'm getting id 18426612010. Looks like internal
			// OMT id, that's wrong, we need OSM
			const id = ['place', 'waterway'].includes(feature.sourceLayer)
					? openMapTilesId
					: openMapTilesId.slice(null, -1),
				featureType =
					feature.sourceLayer === 'waterway'
						? 'way' // bold assumption here
						: feature.sourceLayer === 'place'
						? 'node'
						: { '1': 'way', '0': 'node', '4': 'relation' }[ //this is broken. We're getting the "4" suffix for relations AND ways. See https://github.com/openmaptiles/openmaptiles/issues/1587. See below for hack
								openMapTilesId.slice(-1)
						  ]
			if (!featureType) {
				console.log('Unknown OSM feature type from OpenMapTiles ID')
				return
			}

			const [element, realFeatureType] = await disambiguateWayRelation(
				featureType,
				id,
				e.lngLat
			)

			if (element) {
				console.log('reset OSMfeature after click on POI')
				const { lng: longitude, lat: latitude } = e.lngLat
				replaceArrayIndex(
					state,
					-1,
					{
						osmFeature: {
							...element,
							longitude,
							latitude,
						},
					},
					'merge'
				)

				// We store longitude and latitude in order to, in some cases, avoid a
				// subsequent fetch request on link share
				setSearchParams({
					allez: buildAllezPart(
						element.tags?.name || 'sans nom',
						encodePlace(realFeatureType, id),
						longitude,
						latitude
					),
				})
				console.log('sill set OSMFeature', element)
				// wait for the searchParam update to proceed
			}
		}

		if (!map || distanceMode || itinerary.itineraryMode) return

		map.on('click', onClick)
		return () => {
			if (!map) return
			map.off('click', onClick)
		}
	}, [
		map,
		setState,
		distanceMode,
		itinerary.itineraryMode,
		gares,
		clickGare,
		isTransportsMode,
		setSearchParams,
		setLatLngClicked,
	])

	useHoverOnMapFeatures(map)

	/*
	 *
	 * Fly to hook
	 *
	 * */
	useEffect(() => {
		if (!map || !vers || !osmFeature) return

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
			map.fitBounds(bbox)
			fitBoundsConsideringModal(isMobile, bbox, map)
		} else
			map.flyTo({
				center: [vers.longitude, vers.latitude],
				zoom: tailoredZoom,
				pitch: 50, // pitch in degrees
				bearing: 20, // bearing in degrees
			})
	}, [map, vers, osmFeature])

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
			{map && (
				<MapComponents
					{...{
						map,
						vers,
						transportsData,
						setTempStyle,
						isTransportsMode,
						styleKey,
						searchParams,
					}}
				/>
			)}
			<div ref={mapContainerRef} />
		</>
	)
}
