'use client'
import Emoji from '@/components/Emoji'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import categories from './categories.yaml'
import { createPolygon, createSearchBBox } from './createSearchPolygon'
import { sortGares } from './gares'

import useSetSearchParams from '@/components/useSetSearchParams'
import { extractOsmFeature } from '@/components/voyage/fetchPhoton'
import MapButtons from '@/components/voyage/MapButtons'
import { goodIconSize } from '@/components/voyage/mapUtils'
import { centerOfMass } from '@turf/turf'
import parseOpeningHours from 'opening_hours'
import ModalSwitch from './ModalSwitch'
import { disambiguateWayRelation, osmRequest } from './osmRequest'
import { categoryIconUrl } from './QuickFeatureSearch'
import { MapContainer, MapHeader } from './UI'
import { decodePlace, encodePlace } from './utils'
import { useZoneImages } from './ZoneImages'
import { getCategory } from '@/components/voyage/categories'
import { styles } from './styles'
import useTerrainControl from './useTerrainControl'
import useDrawRoute from './itinerary/useDrawRoute'
import useItinerary from './itinerary/useItinerary'
import useHoverOnMapFeatures from './useHoverOnMapFeatures'
import { computeCssVariable } from '@/components/utils/colors'
import { fromHTML } from '@/components/utils/htmlUtils'

const defaultCenter =
	// Saint Malo [-1.9890417068124002, 48.66284934737089]
	[-1.6776317608896583, 48.10983044383964]

export const defaultState = {
	depuis: { inputValue: '', choice: false },
	vers: { inputValue: '', choice: false },
	validated: false,
}
const defaultZoom = 8
export default function Map({ searchParams }) {
	const [state, setState] = useState(defaultState)
	const [osmFeature, setOsmFeature] = useState(null)
	const [latLngClicked, setLatLngClicked] = useState(null)
	const [zoom, setZoom] = useState(defaultZoom)
	const [bikeRouteProfile, setBikeRouteProfile] = useState('safety')
	const [distanceMode, setDistanceMode] = useState(false)
	const [itineraryMode, setItineraryMode] = useState(false)
	const [styleChooser, setStyleChooser] = useState(false)

	const styleKey = searchParams.style || 'base',
		style = styles[styleKey],
		styleUrl = styles[styleKey].url
	const setSearchParams = useSetSearchParams()

	const place = searchParams.lieu,
		[featureType, featureId] = place
			? decodePlace(place)
			: extractOsmFeature(state.vers.choice)

	const category = getCategory(searchParams)

	const showOpenOnly = searchParams.o

	const [zoneImages, resetZoneImages] = useZoneImages({
		latLngClicked,
		setLatLngClicked,
	})

	if (process.env.NEXT_PUBLIC_MAPTILER == null) {
		throw new Error('You have to configure env REACT_APP_API_KEY, see README')
	}

	const mapContainerRef = useRef(null)

	const choice = state.vers?.choice
	const center = useMemo(
		() => choice && [choice.item.longitude, choice.item.latitude],
		[choice]
	)

	const [gares, setGares] = useState(null)
	const [map, setMap] = useState(null)
	const [clickedGare, clickGare] = useState(null)
	const [bikeRoute, setBikeRoute] = useState(null)
	const [distance, reset, route] = useItinerary(
		map,
		itineraryMode,
		bikeRouteProfile
	)

	const itinerary = {
		bikeRouteProfile,
		itineraryMode,
		setItineraryMode,
		distance,
		reset,
		route,
	}
	const [features, setFeatures] = useState([])

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

			const queries = Object.entries(category.query)

			if (queries.length !== 1) throw Error('Syntax not supported yet')
			const queryCore = queries
				.map(([k, v]) => {
					if (typeof v === 'string') return `['${k}'='${v}']`
					if (Array.isArray(v)) return `['${k}'~'${v.join('|')}']`
					//query: '["shop"~"convenience|supermarket"]'
				})
				.join('')
			const overpassRequest = `
[out:json];
(
  nw${queryCore}(${bbox});
);

out body;
>;
out skel qt;

`
			const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
				overpassRequest
			)}`
			console.log(url)
			const request = await fetch(url)
			const json = await request.json()
			const namedElements = json.elements.filter((element) => {
				if (!['way', 'node'].includes(element.type)) return false
				return true
			})
			console.log({ namedElements })
			const nodeElements = namedElements.map((element) => {
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
				console.log({ polygon })
				const center = centerOfMass(polygon)

				console.log('center', center)
				const [lon, lat] = center.geometry.coordinates
				console.log({ lon, lat })

				return { ...element, lat, lon, polygon }
			})

			setFeatures(nodeElements)
		}
		fetchCategories()
	}, [category, map])

	useEffect(() => {
		if (!map || features.length < 1 || !category) return

		const shownFeatures = !showOpenOnly
			? features
			: features.filter((f) => {
					if (!f.tags || f.tags.opening_hours) return false
					try {
						const oh = new parseOpeningHours(f.tags.opening_hours, {
							address: { country_code: 'fr' },
						})
						return oh.getState()
					} catch (e) {
						return false
					}
			  })

		const asyncLoadImage = async () => {
			const imageUrl = categoryIconUrl(category)

			fetch(imageUrl)
				.then((response) => response.text())
				.then((text) => {
					// If both the image and svg are found, replace the image with the svg.
					const img = new Image(40, 40)

					const svg = fromHTML(text)
					const svgSize = svg.getAttribute('width'), // Icons must be square !
						xyr = svgSize / 2
					const backgroundDisk = `<circle
     style="fill:${encodeURIComponent(
				computeCssVariable('--color')
			)};fill-rule:evenodd"
     cx="${xyr}"
     cy="${xyr}"
     r="${xyr}" />`
					const newInner = `${backgroundDisk}<g style="fill:white;" transform="scale(.7)" transform-origin="center" transform-box="fill-box">${svg.innerHTML}</g>`
					svg.innerHTML = newInner
					console.log('svg', newInner)
					console.log(svg.outerHTML)

					img.src = 'data:image/svg+xml;charset=utf-8,' + svg.outerHTML

					img.onload = () => {
						const imageName = category.name + '-futureco'
						const mapImage = map.getImage(imageName)
						if (!mapImage) map.addImage(imageName, img)
						console.log('OYOYO', category.name, img)

						console.log('features', shownFeatures, features)
						map.addSource('features-points', {
							type: 'geojson',
							data: {
								type: 'FeatureCollection',
								features: shownFeatures.map((f) => {
									const geometry = {
										type: 'Point',
										coordinates: [f.lon, f.lat],
									}

									const tags = f.tags || {}
									return {
										type: 'Feature',
										geometry,
										properties: {
											id: f.id,
											tags,
											name: tags.name,
											featureType: f.type,
										},
									}
								}),
							},
						})
						map.addSource('features-ways', {
							type: 'geojson',
							data: {
								type: 'FeatureCollection',
								features: shownFeatures
									.filter((f) => f.polygon)
									.map((f) => {
										const tags = f.tags || {}
										return {
											type: 'Feature',
											geometry: f.polygon.geometry,
											properties: {
												id: f.id,
												tags,
												name: tags.name,
											},
										}
									}),
							},
						})

						// Add a symbol layer
						map.addLayer({
							id: 'features-ways',
							type: 'fill',
							source: 'features-ways',
							layout: {},
							paint: {
								'fill-color': '#088',
								'fill-opacity': 0.6,
							},
						})
						map.addLayer({
							id: 'features-points',
							type: 'symbol',
							source: 'features-points',
							layout: {
								'icon-image': category.name + '-futureco',
								'icon-size': 0.6,
								'text-field': ['get', 'name'],
								'text-offset': [0, 1.25],
								'text-anchor': 'top',
							},
							paint: {
								'text-color': '#503f38',
								'text-halo-blur': 0.5,
								'text-halo-color': 'white',
								'text-halo-width': 1,
							},
						})
					}
				})
		}

		asyncLoadImage()

		return () => {
			try {
				map.removeLayer('features-points')
				map.removeSource('features-points')
				map.removeLayer('features-ways')
				map.removeSource('features-ways')
			} catch (e) {
				console.warn(e)
			}
		}
	}, [features, map, showOpenOnly, category])

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

	useEffect(() => {
		console.log('remove', [map, setMap, styleUrl, setZoom, mapContainerRef])
		if (!mapContainerRef.current) return undefined
		console.log('styleUrl', styleUrl)

		const newMap = new maplibregl.Map({
			container: mapContainerRef.current,
			style: styleUrl,
			center: defaultCenter,
			zoom: defaultZoom,
			hash: true,
		})
		console.log('Has created newMap', newMap)
		newMap.on('load', () => {
			console.log('Will set newMap to state.map')
			setMap(newMap)

			newMap.addControl(
				new maplibregl.NavigationControl({
					visualizePitch: true,
					showZoom: true,
					showCompass: true,
				}),
				'top-right'
			)

			newMap.addControl(
				new maplibregl.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true,
					},
					trackUserLocation: true,
				})
			)

			setZoom(Math.round(newMap.getZoom()))
		})

		return () => {
			console.log('remove newmap', newMap['_mapId'])
			newMap?.remove()
		}
	}, [setMap, styleUrl, setZoom, mapContainerRef])

	useTerrainControl(map, style)

	useEffect(() => {
		if (!map) return
		map.on('zoom', () => {
			const approximativeZoom = Math.round(map.getZoom())
			if (approximativeZoom !== zoom) setZoom(approximativeZoom)
		})
	}, [zoom, setZoom, map])

	useEffect(() => {
		if (!map) return

		map.setStyle(styleUrl)
	}, [styleUrl, map])

	useDrawRoute(map, bikeRoute, 'bikeRoute')

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

			const allowedLayerProps = ({
				properties: { class: c },
				sourceLayer: layer,
			}) =>
				layer === 'poi' ||
				(layer === 'place' &&
					['city', 'suburb', 'neighbourhood', 'quarter'].includes(c)) // Why ? because "state" does not map to an existing OSM id in France at least, see https://github.com/openmaptiles/openmaptiles/issues/792#issuecomment-1850139297
			// TODO when "state" place, make an overpass request with name, since OMT's doc explicitely says that name comes from OSM

			// Thanks OSMAPP https://github.com/openmaptiles/openmaptiles/issues/792
			const rawFeatures = map.queryRenderedFeatures(e.point),
				features = rawFeatures.filter(
					(f) => f.source === 'maptiler_planet' && allowedLayerProps(f)
				)

			console.log('rawFeatures', rawFeatures)
			if (!features.length || !features[0].id) {
				console.log('no features', features)
				return
			}

			const feature = features[0]
			const openMapTilesId = '' + feature.id

			const id =
					feature.sourceLayer === 'place'
						? openMapTilesId
						: openMapTilesId.slice(null, -1),
				featureType =
					feature.sourceLayer === 'place'
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

		if (!map || distanceMode) return
		map.on('click', onClick)
		return () => {
			if (!map) return
			map.off('click', onClick)
		}
	}, [map, setState, distanceMode, gares])

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
			if (!choice || choice.item.osmId !== featureId) {
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
		if (!map || distanceMode) return

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
	}, [map, distanceMode, setSearchParams])

	useHoverOnMapFeatures(map)

	useEffect(() => {
		if (!map || !center) return

		const marker = state.vers.marker

		if (!marker) {
			const destinationType = state.vers.choice.item.type,
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
						choice: {
							item: { latitude: lat, longitude: lng },
						},
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
						resetZoneImages,
						zoom,
						searchParams,
						style,
						styleChooser,
						setStyleChooser,
						distance,
						itinerary,
					}}
				/>
			</MapHeader>
			<MapButtons
				{...{
					style,
					setStyleChooser,
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
