import useSetSearchParams from '@/components/useSetSearchParams'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getLineStrings } from './motisRequest'
import useDrawRoute from './useDrawRoute'

const serializePoints = (points) => {
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
	const [route, setRoute] = useState(null)
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
					coordinates: [lon, lat],
				},
				properties: {},
			}))
		return points
	}, [searchParams])

	const linestrings = useMemo(
		() =>
			route
				? route
				: [
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
		[points, route]
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
	useDrawRoute(itineraryMode && map, geojson, 'route')

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
			setRoute(null)
			return
		}

		async function fetchTrainRoute(points) {
			if (points.length > 2) return
			const lonLats = points.map(
				({
					geometry: {
						coordinates: [lng, lat],
					},
				}) => ({ lat, lng })
			)

			const json = getLineStrings(lonLats[0], lonLats[1])
			return

			console.log('Train route json', json)
			if (!json.journeys) return setRoute(null)
			const sections = json.journeys[0].sections
			setRoute(
				sections.map((el) => ({
					type: 'Feature',
					properties: el.geojson.properties[0],
					geometry: { coordinates: el.geojson.coordinates, type: 'LineString' },
				}))
			)
		}
		async function fetchBikeRoute(points) {
			const lonLats = points
				.map(
					({
						geometry: {
							coordinates: [lon, lat],
						},
					}) => `${lon},${lat}`
				)
				.join('|')
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lonLats}&profile=${bikeRouteProfile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			console.log('Brouter route json', json)
			if (!json.features) return
			setRoute(json.features)
		}
		//fetchBikeRoute(points)
		fetchTrainRoute(points)
		return undefined
	}, [points, setRoute, bikeRouteProfile])
	// GeoJSON object to hold our measurement features

	useEffect(() => {
		if (!map || itineraryMode || map.getSource) return
		const source = map.getSource('measure-points')
		if (!source) return

		map.removeLayer('measure-lines')
		map.removeLayer('measure-points')
		map.removeSource('measure-points')
	}, [itineraryMode, map, points])

	const distance = isNaN(rawDistance)
		? '...'
		: rawDistance < 1
		? Math.round(rawDistance * 1000) + ' m'
		: rawDistance < 10
		? Math.round(rawDistance * 10) / 10 + ' km'
		: Math.round(rawDistance) + ' km'

	const resetDistance = () => setPoints([])
	return [distance, resetDistance, route]
}
