'use client'
import {
	CityImage,
	Destination,
	ImageWithNameWrapper,
} from '@/components/conversation/VoyageUI'
import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import destinationPoint from '@/public/destination-point.svg'
import getCityData, { toThumb } from 'Components/wikidata'
import { motion } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import NextImage from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import categories from './categories.yaml'
import { createPolygon, createSearchBBox } from './createSearchPolygon'
import { sortGares } from './gares'

import useSetSeachParams from '@/components/useSetSearchParams'
import useTraceComponentUpdate from '@/components/utils/useTraceComponentUpdate'
import MapButtons from '@/components/voyage/MapButtons'
import { centerOfMass } from '@turf/turf'
import parseOpeningHours from 'opening_hours'
import ModalSwitch from './ModalSwitch'
import { osmRequest } from './osmRequest'
import PlaceSearch from './PlaceSearch'
import QuickFeatureSearch, { categoryIconUrl } from './QuickFeatureSearch'
import { MapContainer, MapHeader } from './UI'
import { decodePlace, encodePlace } from './utils'
import { extractOsmFeature } from '@/components/voyage/fetchPhoton'
import { goodIconSize } from '@/components/voyage/mapUtils'
import { useZoneImages } from './ZoneImages'

const defaultCenter =
	// Saint Malo [-1.9890417068124002, 48.66284934737089]
	[-1.6776317608896583, 48.10983044383964]

const defaultState = {
	depuis: { inputValue: '', choice: false },
	vers: { inputValue: '', choice: false },
	validated: false,
}
const defaultZoom = 8
const styleKeys = {
	streets: '2f80a9c4-e0dd-437d-ae35-2b6c212f830b',
	satellite: 'satellite',
}
export default function Map({ searchParams }) {
	useTraceComponentUpdate(searchParams, 'map')
	const [state, setState] = useState(defaultState)
	try {
		console.log('state', state, state.vers.choice.item.type)
	} catch (e) {}
	const [isSheetOpen, setSheetOpen] = useState(false)
	const [wikidata, setWikidata] = useState(null)
	const [osmFeature, setOsmFeature] = useState(null)
	const [latLngClicked, setLatLngClicked] = useState(null)
	const [zoom, setZoom] = useState(defaultZoom)
	const [bikeRouteProfile, setBikeRouteProfile] = useState('safety')
	const [localSearch, setLocalSearch] = useState(true)
	const [distanceMode, setDistanceMode] = useState(false)

	const style = searchParams.style || 'streets'
	const styleKey = styleKeys[style]
	const setSearchParams = useSetSeachParams()

	const place = searchParams.lieu,
		[featureType, featureId] = place
			? decodePlace(place)
			: extractOsmFeature(state.vers.choice)

	console.log('OSM', featureType, featureId)

	const categoryName = searchParams.cat,
		category = categoryName && categories.find((c) => c.name === categoryName)

	const showOpenOnly = searchParams.o

	const zoneImages = useZoneImages({ latLngClicked, setLatLngClicked })

	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	if (process.env.NEXT_PUBLIC_MAPTILER == null) {
		throw new Error('You have to configure env REACT_APP_API_KEY, see README')
	}

	const mapContainerRef = useRef()

	const choice = state.vers?.choice
	const center = useMemo(
		() => choice && [choice.item.longitude, choice.item.latitude],
		[choice]
	)

	const [gares, setGares] = useState(null)
	const [map, setMap] = useState(null)
	const [clickedGare, clickGare] = useState(null)
	const [bikeRoute, setBikeRoute] = useState(null)
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
				if (!element.tags || !element.tags.name) return false
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
					if (!f.tags.opening_hours) return false
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
					const img = new Image(20, 20)
					img.src = 'data:image/svg+xml;charset=utf-8,' + text

					console.log('SRC', img.src)

					img.onload = () => {
						map.addImage(category.name + '-futureco', img)
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

									return {
										type: 'Feature',
										geometry,
										properties: {
											id: f.id,
											tags: f.tags,
											name: f.tags.name,
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
									.filter((f) => console.log('polyg', f.polygon) || f.polygon)
									.map((f) => {
										return {
											type: 'Feature',
											geometry: f.polygon.geometry,
											properties: {
												id: f.id,
												tags: f.tags,
												name: f.tags.name,
											},
										}
									}),
							},
						})

						// Add a symbol layer
						map.addLayer({
							id: 'features-points',
							type: 'symbol',
							source: 'features-points',
							layout: {
								'icon-image': category.name + '-futureco',
								'icon-size': 1.3,
								'text-field': ['get', 'name'],
								'text-offset': [0, 1.25],
								'text-anchor': 'top',
							},
						})
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
		const newMap = new maplibregl.Map({
			container: mapContainerRef.current,
			style: `https://api.maptiler.com/maps/${styleKey}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`,
			center: defaultCenter,
			zoom: defaultZoom,
			hash: true,
		})
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

		return () => {
			newMap.remove()
		}
	}, [setMap, styleKey, setZoom])

	useEffect(() => {
		if (!map) return
		map.on('zoom', () => {
			const approximativeZoom = Math.round(map.getZoom())
			if (approximativeZoom !== zoom) setZoom(approximativeZoom)
		})
	}, [zoom, setZoom, map])

	useEffect(() => {
		if (!map) return

		map.setStyle(
			`https://api.maptiler.com/maps/${styleKey}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`
		)
	}, [styleKey, map])

	useEffect(() => {
		if (!map || !bikeRoute || !bikeRoute.features) return

		map.addSource('bikeRoute', {
			type: 'geojson',
			data: bikeRoute.features[0],
		})
		map.addLayer({
			id: 'bikeRouteContour',
			type: 'line',
			source: 'bikeRoute',
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#5B099F',
				'line-width': 8,
			},
		})
		map.addLayer({
			id: 'bikeRoute',
			type: 'line',
			source: 'bikeRoute',
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#B482DD',
				'line-width': 5,
			},
		})

		return () => {
			map.removeLayer('bikeRoute')
			map.removeLayer('bikeRouteContour')
			map.removeSource('bikeRoute')
		}
	}, [bikeRoute, map])

	useEffect(() => {
		const onClick = async (e) => {
			console.log('click event', e)
			setLatLngClicked(e.lngLat)

			setSheetOpen(true)

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

			// Thanks OSMAPP https://github.com/openmaptiles/openmaptiles/issues/792
			const features = map
				.queryRenderedFeatures(e.point)
				.filter((f) => f.source === 'maptiler_planet')

			if (!features.length || !features[0].id) {
				console.log('no features', features)
				return
			}

			const openMapTilesId = '' + features[0].id

			console.log('renderedFeatures', features)
			const id = openMapTilesId.slice(null, -1),
				featureType = { '1': 'way', '0': 'node', '4': 'relation' }[
					openMapTilesId.slice(-1)
				]
			if (!featureType) {
				console.log('Unknown OSM feature type from OpenMapTiles ID')
				return
			}
			console.log(features, id, openMapTilesId)

			setSearchParams({ lieu: encodePlace(featureType, id) })

			const elements = await osmRequest(featureType, id)

			console.log('Résultat OSM', elements)
			if (!elements.length) return

			setOsmFeature(elements[0])

			const uic = elements[0].tags?.uic_ref,
				gare = gares && gares.find((g) => g.uic.includes(uic))
			if (uic && gare) clickGare(gare)
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

			const element = elements.find((el) => el.id === featureId)

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
			const center = !full
				? [element.lon, element.lat]
				: centerOfMass(
						featureCollectionFromOsmNodes(
							elements.filter((el) => el.lat && el.lon)
						)
				  ).geometry.coordinates

			setOsmFeature(element)
			setSheetOpen(true)
			console.log('should fly to', center)
			if (state.vers.choice?.item.osmId !== featureId) {
				map.flyTo({
					center,
					zoom: 18,
					pitch: 50, // pitch in degrees
					bearing: 20, // bearing in degrees
				})
			}
		}
		request()
	}, [map, featureType, featureId, state.vers.choice])

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

			setOsmFeature({ ...properties, tags })
		})
		map.on('mouseenter', 'features-points', () => {
			map.getCanvas().style.cursor = 'pointer'
		})
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', 'features-points', () => {
			map.getCanvas().style.cursor = ''
		})
	}, [map, distanceMode])

	useEffect(() => {
		if (!map || !center) return

		const marker = state.vers.marker

		if (!marker) {
			const destinationType = state.vers.choice.item.type,
				tailoredZoom = ['city'].includes(destinationType)
					? 11
					: Math.max(15, zoom)
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
				setSheetOpen(true)
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
				<div
					css={`
						display: flex;
						align-items: center;
					`}
				>
					{choice && (
						<button
							onClick={() => setState(defaultState)}
							css={`
								background: white;
								border: 3px solid var(--color);
								width: 2.5rem;
								height: 2.5rem;
								border-radius: 3rem;
								display: inline-flex;
								margin: 0 0.6rem;
								align-items: center;
								justify-content: center;
							`}
						>
							<Emoji e="✏️" />
						</button>
					)}
				</div>
				{!choice && (
					<PlaceSearch {...{ state, setState, localSearch, setLocalSearch }} />
				)}
				{choice && versImageURL && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{}}
						key={versImageURL}
						exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
					>
						<ImageWithNameWrapper>
							<CityImage
								src={versImageURL}
								alt={`Une photo emblématique de la destination, ${state.vers.choice?.item?.nom}`}
							/>
							<Destination>
								<NextImage src={destinationPoint} alt="Vers" />
								<h2>{state.vers.choice.item.nom}</h2>
							</Destination>
						</ImageWithNameWrapper>
					</motion.div>
				)}
				{zoom > 12 && (
					<QuickFeatureSearch category={category} searchParams={searchParams} />
				)}

				<ModalSwitch
					{...{
						isSheetOpen: !distanceMode && isSheetOpen,
						setSheetOpen,
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
					}}
				/>
			</MapHeader>
			<MapButtons {...{ style, distanceMode, setDistanceMode, map }} />
			<div ref={mapContainerRef} />
		</MapContainer>
	)
}
