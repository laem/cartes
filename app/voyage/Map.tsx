'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPolygon, createSearchBBox } from './createSearchPolygon'
import { sortGares } from './gares'

import useSetSearchParams from '@/components/useSetSearchParams'
import { getCategory } from '@/components/voyage/categories'
import { extractOsmFeature } from '@/components/voyage/fetchPhoton'
import MapButtons from '@/components/voyage/MapButtons'
import { goodIconSize } from '@/components/voyage/mapUtils'
import { centerOfMass } from '@turf/turf'
import useAddMap, { defaultZoom } from './effects/useAddMap'
import useDrawQuickSearchFeatures from './effects/useDrawQuickSearchFeatures'
import useImageSearch from './effects/useImageSearch'
import useItinerary from './itinerary/useItinerary'
import useItineraryFromUrl from './itinerary/useItineraryFromUrl'
import ModalSwitch from './ModalSwitch'
import { disambiguateWayRelation, osmRequest } from './osmRequest'
import { styles } from './styles/styles'
import { MapContainer, MapHeader } from './UI'
import useHoverOnMapFeatures from './useHoverOnMapFeatures'
import useTerrainControl from './useTerrainControl'
import { decodePlace, encodePlace } from './utils'
import { useZoneImages } from './ZoneImages'

import { clickableClasses } from './clickableLayers'
import useDrawTransport from './effects/useDrawTransport'
import useTransportStopData from './transport/useTransportStopData'
import useDrawSearchResults from './effects/useDrawSearchResults'
import useRightClick from './effects/useRightClick'

export const defaultState = {
	depuis: { inputValue: null, choice: false },
	vers: { inputValue: null, choice: false },
	validated: false,
}
export default function Map({ searchParams }) {
	const mapContainerRef = useRef(null)
	const [zoom, setZoom] = useState(defaultZoom)
	const [bbox, setBbox] = useState(null)
	const [safeStyleKey, setSafeStyleKey] = useState(null)
	const [tempStyle, setTempStyle] = useState(null)
	const styleKey = tempStyle || searchParams.style || 'base',
		style = styles[styleKey],
		styleUrl = styles[styleKey].url
	const map = useAddMap(styleUrl, setZoom, setBbox, mapContainerRef)

	// This is a generic name herited from the /ferry and /avion pages, state means the from and to box's states.
	// From is not currently used but will be.
	const [state, setState] = useState(defaultState)
	useDrawSearchResults(map, state)
	const [osmFeature, setOsmFeature] = useState(null)
	const [latLngClicked, setLatLngClicked] = useState(null)
	const [bikeRouteProfile, setBikeRouteProfile] = useState('safety')
	const [distanceMode, setDistanceMode] = useState(false)
	const [itineraryMode, setItineraryMode] = useState(false)
	const [styleChooser, setStyleChooser] = useState(false)

	const allez = searchParams.allez
	useItineraryFromUrl(allez, setItineraryMode, map)

	const setSearchParams = useSetSearchParams()

	const place = searchParams.lieu,
		[featureType, featureId] = place
			? decodePlace(place)
			: extractOsmFeature(state.vers.choice)

	const category = getCategory(searchParams)

	const showOpenOnly = searchParams.o

	const [zoneImages, panoramaxImages, resetZoneImages] = useZoneImages({
		latLngClicked,
		setLatLngClicked,
	})

	useImageSearch(map, zoom, bbox, searchParams.photos === 'oui')

	if (process.env.NEXT_PUBLIC_MAPTILER == null) {
		throw new Error(
			'You have to configure env NEXT_PUBLIC_MAPTILER, see README'
		)
	}

	const choice = state.vers?.choice
	const center = useMemo(
		() => choice && [choice.longitude, choice.latitude],
		[choice]
	)

	const transportStopData = useTransportStopData(osmFeature)
	useEffect(() => {
		if (!transportStopData || !transportStopData.routesGeojson) return
		console.log('debug', transportStopData.routesGeojson)

		setTempStyle('dataviz')

		return () => {
			console.log('will unset')
			setTempStyle(null)
		}
	}, [setTempStyle, transportStopData])

	useDrawTransport(map, transportStopData, safeStyleKey)
	const [gares, setGares] = useState(null)
	const [clickedGare, clickGare] = useState(null)
	const [bikeRoute, setBikeRoute] = useState(null)
	const [resetItinerary, routes, date] = useItinerary(
		map,
		itineraryMode,
		bikeRouteProfile,
		searchParams
	)

	const itinerary = {
		bikeRouteProfile,
		itineraryMode,
		setItineraryMode,
		reset: resetItinerary,
		routes,
		date,
	}
	console.log('itinerary', itinerary)
	const [features, setFeatures] = useState([])
	console.log('baobab features', features)

	useEffect(() => {
		if (!map || !category) return

		const fetchCategories = async () => {
			const mapLibreBbox = map.getBounds().toArray(),
				bbox = [
					mapLibreBbox[0][1],
					mapLibreBbox[0][0],
					mapLibreBbox[1][1],
					mapLibreBbox[1][0],
				].join(',')

			const queries =
				typeof category.query === 'string' ? [category.query] : category.query

			const queryCore = queries
				.map((query) => {
					return `nw${query}(${bbox});`
				})
				.join('')
			// TODO we're missing the "r" in "nwr" for "relations"
			const overpassRequest = `
[out:json];
(
${queryCore}
);

out body;
>;
out skel qt;

`

			console.log('overpass', overpassRequest)
			const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
				overpassRequest
			)}`
			console.log(url)
			const request = await fetch(url)
			const json = await request.json()

			const nodesOrWays = json.elements.filter((element) => {
				if (!['way', 'node'].includes(element.type)) return false // TODO relations should be handled
				return true
			})

			const waysNodes = nodesOrWays
				.filter((el) => el.type === 'way')
				.map((el) => el.nodes)
				.flat()
			const interestingElements = nodesOrWays.filter(
				(el) => !waysNodes.find((id) => id === el.id)
			)
			const nodeElements = interestingElements.map((element) => {
				if (element.type === 'node') return element
				const nodes = element.nodes.map((id) =>
						json.elements.find((el) => el.id === id)
					),
					polygon = {
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [nodes.map(({ lat, lon }) => [lon, lat])],
						},
					}
				const center = centerOfMass(polygon)

				const [lon, lat] = center.geometry.coordinates

				return { ...element, lat, lon, polygon }
			})

			setFeatures(nodeElements)
		}
		fetchCategories()
	}, [category, map])

	useDrawQuickSearchFeatures(map, features, showOpenOnly, category)

	useEffect(() => {
		if (!center || !clickedGare) return

		const [lon1, lat1] = clickedGare.coordonnées,
			[lon2, lat2] = center

		async function fetchBikeRoute() {
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lon1},${lat1}|${lon2},${lat2}&profile=${bikeRouteProfile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			setBikeRoute(json)
		}

		fetchBikeRoute()
	}, [center, clickedGare, bikeRouteProfile])
	useEffect(() => {
		async function fetchGares() {
			const res = await fetch('/gares.json')
			const json = await res.json()
			setGares(json)
		}
		fetchGares()
	}, [setGares])

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
		console.log(
			'onload useEffect style hook mapId ',
			map._mapId,
			' from ',
			styleKey,
			' to ',
			prevStyleKey
		)

		console.log('onload should diff', styleKey !== 'base')
		// diff seems to fail because of a undefined sprite error showed in the
		// console
		// hence this diff: false. We're not loosing much
		map.setStyle(styleUrl, { diff: false }) //setting styleKey!== 'base' doesn't work, probably because the error comes from switching from base to another ?
		setTimeout(() => {
			// Hack : I haven't found a way to know when this style change is done, hence this setTimeout, absolutely not a UI problem but could be too quick ?
			setSafeStyleKey(styleKey)
		}, 300)
	}, [styleUrl, map, styleKey, prevStyleKey])

	const [clickedPoint, resetClickedPoint] = useRightClick(map)
	console.log('jaune point', clickedPoint)

	useEffect(() => {
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

			console.log('rawFeatures', rawFeatures)
			console.log('filteredFeatures', features)
			if (!features.length || !features[0].id) {
				console.log('no features', features)
				return
			}

			const feature = features[0]
			const openMapTilesId = '' + feature.id

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
			console.log('Clicked features from openmaptiles', {
				features,
				id,
				featureType,
				openMapTilesId,
			})

			const [element, realFeatureType] = await disambiguateWayRelation(
				featureType,
				id,
				e.lngLat
			)

			if (element) {
				console.log('reset OSMfeature after click on POI')
				console.log('will set lieu searchparam after click on POI')
				setOsmFeature(element)
				setSearchParams({ lieu: encodePlace(realFeatureType, id) })
				console.log('sill set OSMFeature', element)
				// wait for the searchParam update to proceed
				const uic = element.tags?.uic_ref,
					gare = gares && gares.find((g) => g.uic.includes(uic))
				if (uic && gare) clickGare(gare)
			}
		}

		if (!map || distanceMode || itineraryMode) return

		map.on('click', onClick)
		return () => {
			if (!map) return
			map.off('click', onClick)
		}
	}, [map, setState, distanceMode, itineraryMode, gares])

	useEffect(() => {
		if (!map || !featureType || !featureId) return
		if (osmFeature && osmFeature.id == featureId) return
		const request = async () => {
			console.log('Preparing OSM request ', featureType, featureId)
			const full = ['way', 'relation'].includes(featureType)
			const isNode = featureType === 'node'
			if (!isNode && !full)
				return console.log(
					"This OSM feature is neither a node, a relation or a way, we don't know how to handle it"
				)

			const elements = await osmRequest(featureType, featureId, full)
			if (!elements.length) return
			console.log(
				'OSM elements received',
				elements,
				' for ',
				featureType,
				featureId
			)

			const element = elements.find((el) => el.id == featureId)

			const featureCollectionFromOsmNodes = (nodes) => {
				console.log('yanodes', nodes)
				const fc = {
					type: 'FeatureCollection',
					features: nodes.map((el) => ({
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [el.lon, el.lat],
						},
					})),
				}
				console.log('centerofmass', fc, centerOfMass(fc))
				return fc
			}
			const relation = elements.find((el) => el.id == featureId),
				adminCenter =
					relation &&
					relation.members?.find((el) => el.role === 'admin_centre'),
				adminCenterNode =
					adminCenter && elements.find((el) => el.id == adminCenter.ref)

			console.log('admincenter', relation, adminCenter, adminCenterNode)
			const center = adminCenterNode
				? [adminCenterNode.lon, adminCenterNode.lat]
				: !full
				? [element.lon, element.lat]
				: centerOfMass(
						featureCollectionFromOsmNodes(
							elements.filter((el) => el.lat && el.lon)
						)
				  ).geometry.coordinates

			console.log('will set OSMfeature after loading it from the URL')
			setOsmFeature(element)
			console.log('should fly to', center)
			if (!choice || choice.osmId !== featureId) {
				console.log(
					'will fly to in after OSM download from url query param',
					center
				)
				map.flyTo({
					center,
					zoom: 18,
					pitch: 50, // pitch in degrees
					bearing: 20, // bearing in degrees
				})
			}
		}
		request()
	}, [map, featureType, featureId, choice, osmFeature])

	useEffect(() => {
		if (!map || distanceMode || itineraryMode) return

		map.on('click', 'features-points', async (e) => {
			const feature = e.features[0]
			const properties = feature.properties,
				tagsRaw = properties.tags
			console.log('quickSearchOSMfeatureClick', feature)
			const tags = typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : tagsRaw

			setSearchParams({
				lieu: encodePlace(properties.featureType, properties.id),
			})

			const osmFeature = { ...properties, tags }
			console.log(
				'will set OSMfeature after quickSearch marker click, ',
				osmFeature
			)
			setOsmFeature(osmFeature)
		})
		map.on('mouseenter', 'features-points', () => {
			map.getCanvas().style.cursor = 'pointer'
		})
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'features-points', () => {
			map.getCanvas().style.cursor = 'auto'
		})
	}, [map, distanceMode, itineraryMode, setSearchParams])

	useHoverOnMapFeatures(map)

	useEffect(() => {
		if (!map || !center) return

		const marker = state.vers.marker

		if (!marker) {
			const destinationType = state.vers.choice.type,
				tailoredZoom = ['city'].includes(destinationType)
					? 12
					: Math.max(15, zoom)
			console.log(
				'will fly to in after OSM download from vers marker',
				center,
				tailoredZoom,
				destinationType
			)
			map.flyTo({
				center,
				zoom: tailoredZoom,
				pitch: 50, // pitch in degrees
				bearing: 20, // bearing in degrees
			})
			const marker = new maplibregl.Marker({
				color: 'var(--darkerColor)',
				draggable: true,
			})
				.setLngLat(center)
				.addTo(map)

			setState((state) => ({ ...state, vers: { ...state.vers, marker } }))
			setLatLngClicked({ lng: center[0], lat: center[1] })

			function onDragEnd() {
				const { lng, lat } = marker.getLngLat()
				setState((state) => ({
					...state,
					vers: {
						...state.vers,
						choice: { latitude: lat, longitude: lng },
					},
				}))
			}

			marker.on('dragend', onDragEnd)
		}
	}, [center, map, state.vers, setState])

	const lesGaresProches =
		center && gares && sortGares(gares, center).slice(0, 30)

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
				clickGare(gare.uic === clickedGare?.uic ? null : gare)
			})

			const marker = new maplibregl.Marker({ element })
				.setLngLat(gare.coordonnées)
				.addTo(map)
			return marker
		})
		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [lesGaresProches, map, zoom])

	return (
		<MapContainer>
			<MapHeader $style={style}>
				<ModalSwitch
					{...{
						setState,
						state,
						clickedGare,
						clickGare,
						setOsmFeature,
						bikeRoute,
						osmFeature,
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
						transportStopData,
						clickedPoint,
						resetClickedPoint,
					}}
				/>
			</MapHeader>
			<MapButtons
				{...{
					style,
					setStyleChooser,
					styleChooser,
					distanceMode,
					setDistanceMode,
					map,
					itinerary,
				}}
			/>
			<div ref={mapContainerRef} />
		</MapContainer>
	)
}
