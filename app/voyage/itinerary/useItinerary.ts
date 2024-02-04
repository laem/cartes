import useSetSearchParams from '@/components/useSetSearchParams'
import distance from '@turf/distance'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { initialDate } from '../GareInfo'
import { computeMotisTrip } from './motisRequest'
import useDrawRoute from './useDrawRoute'

const serializePoints = (points) => {
	if (points.length === 0) return undefined
	const result = points
		// We don't need full precision, just 5 decimals ~ 1m
		// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
		.map(({ geometry: { coordinates } }) =>
			coordinates.map((coordinate) => (+coordinate).toFixed(5)).join('|')
		)
		.join(';')
	return result
}
export default function useItinerary(
	map,
	itineraryMode,
	bikeRouteProfile,
	searchParams
) {
	const [routes, setRoutes] = useState(null)
	const [date, setDate] = useState(initialDate)
	const debouncedDate = useDebounce(date, 1000)

	const updateRoute = (key, value) =>
		setRoutes((routes) => ({ ...routes, [key]: value }))
	const setSearchParams = useSetSearchParams(),
		setPoints = useCallback(
			(newPoints) =>
				console.log('motis newPoints', serializePoints(newPoints)) ||
				setSearchParams({ allez: serializePoints(newPoints) }),
			[setSearchParams]
		)

	/*
	 * {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      -1.6369411434976087,
      48.17932437715612
    ]
  },
  "properties": {
    "id": "1704742857502"
  }
}
	 */
	const points = useMemo(() => {
		const coordinates = searchParams['allez'],
			rawPoints = coordinates?.split(';').map((el) => el.split('|')) || [],
			points = rawPoints.map(([lon, lat]) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [+lon, +lat],
				},
				properties: {},
			}))
		return points
	}, [searchParams])

	const linestrings = useMemo(
		() => [
			{
				type: 'Feature',
				properties: {},

				geometry: {
					type: 'LineString',
					coordinates: points.map((point) => {
						return point.geometry.coordinates
					}),
				},
			},
		],
		[points]
	)

	console.log('linestrings', linestrings)
	const rawDistance = linestrings
		.map((el) => el.properties['track-length'] / 1000)
		.reduce((memo, next) => memo + next, 0)

	const geojson = useMemo(
		() => ({
			type: 'FeatureCollection',
			features: [...points, ...linestrings],
		}),
		[points, linestrings]
	)
	console.log('useDrawRoute from outside', map, geojson)
	useDrawRoute(itineraryMode, map, geojson, 'route')

	useEffect(() => {
		if (!map || !itineraryMode) return

		const onClick = (e) => {
			const features =
				points &&
				map.queryRenderedFeatures(e.point, {
					layers: ['routePoints'],
				})

			// If a feature was clicked, remove it from the map
			if (features?.length) {
				const id = features[0].properties.id
				setPoints(points.filter((p) => p.properties.id !== id))
			} else {
				const point = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [e.lngLat.lng, e.lngLat.lat],
					},
					properties: {
						id: String(new Date().getTime()),
					},
				}

				setPoints([...points, point])
			}
		}
		const onMouseMove = (e) => {
			const features =
				points &&
				map.queryRenderedFeatures(e.point, {
					layers: ['routePoints'],
				})
			// UI indicator for clicking/hovering a point on the map
			map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair'
		}

		/*
		if (!itineraryMode) {
			map.off('click', onClick)
			map.off('mousemove', onMouseMove)
			return
		}
		*/

		map.on('click', onClick)
		map.on('mousemove', onMouseMove)
		return () => {
			if (!map || !itineraryMode) return
			map.off('click', onClick)
			map.off('mousemove', onMouseMove)
			map.getCanvas().style.cursor = 'pointer'
		}
	}, [map, points, setPoints, itineraryMode])

	useEffect(() => {
		if (points.length < 2) {
			setRoutes(null)
			return
		}

		async function fetchTrainRoute(points, itineraryDistance, date) {
			const minTransitDistance = 0.5 // please walk or bike
			if (itineraryDistance < minTransitDistance) return null
			if (points.length > 2) return
			const lonLats = points.map(
				({
					geometry: {
						coordinates: [lng, lat],
					},
				}) => ({ lat, lng })
			)

			const json = await computeMotisTrip(lonLats[0], lonLats[1], date)

			if (json.state === 'error') return json

			if (!json?.content) return null
			/*
			return sections.map((el) => ({
				type: 'Feature',
				properties: el.geojson.properties[0],
				geometry: { coordinates: el.geojson.coordinates, type: 'LineString' },
			}))
			*/
			return json.content
		}
		async function fetchBrouterRoute(points, itineraryDistance, profile) {
			const maxBikeDistance = 35 // ~ 25 km/h (ebike) x 1:30 hours
			if (itineraryDistance > maxBikeDistance) return null

			const lonLats = points
				.map(
					({
						geometry: {
							coordinates: [lon, lat],
						},
					}) => `${lon},${lat}`
				)
				.join('|')
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lonLats}&profile=${profile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			console.log('Brouter route json', json)
			if (!json.features) return
			return json.features
		}

		//TODO fails is 3rd point is closer to 1st than 2nd, use reduce that sums
		const itineraryDistance = distance(points[0], points.slice(-1)[0])

		const fetchRoutes = async () => {
			updateRoute('cycling', 'loading')
			fetchBrouterRoute(points, itineraryDistance, bikeRouteProfile).then(
				(cycling) => setRoutes((routes) => ({ ...routes, cycling }))
			)
			updateRoute('walking', 'loading')
			fetchBrouterRoute(points, itineraryDistance, 'hiking-mountain').then(
				(walking) => setRoutes((routes) => ({ ...routes, walking }))
			)
			updateRoute('transit', { state: 'loading' })
			fetchTrainRoute(points, itineraryDistance, debouncedDate).then(
				(transit) => setRoutes((routes) => ({ ...routes, transit }))
			)
		}
		fetchRoutes()
	}, [points, setRoutes, bikeRouteProfile, debouncedDate])
	// GeoJSON object to hold our measurement features

	useEffect(() => {
		if (!map || itineraryMode || map.getSource) return
		const source = map.getSource('measure-points')
		if (!source) return

		map.removeLayer('measure-lines')
		map.removeLayer('measure-points')
		map.removeSource('measure-points')
	}, [itineraryMode, map, points])

	/* Not sure it's useful to display the distance in this multimodal new mode
	const computedDistance = isNaN(rawDistance)
		? '...'
		: rawDistance < 1
		? Math.round(rawDistance * 1000) + ' m'
		: rawDistance < 10
		? Math.round(rawDistance * 10) / 10 + ' km'
		: Math.round(rawDistance) + ' km'

*/
	const resetItinerary = () => setPoints([])
	return [resetItinerary, routes, date, setDate]
}
