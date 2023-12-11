import { useEffect, useMemo, useState } from 'react'
import length from '@turf/length'
import useDrawRoute from './useDrawRoute'

export default function useItinerary(map, itineraryMode, bikeRouteProfile) {
	const [points, setPoints] = useState([])
	const [route, setRoute] = useState(null)

	const linestring = useMemo(
		() =>
			route
				? route.features[0]
				: {
						type: 'Feature',
						properties: {},

						geometry: {
							type: 'LineString',
							coordinates: points.map((point) => {
								return point.geometry.coordinates
							}),
						},
				  },
		[points, route]
	)
	const rawDistance = linestring.properties['track-length'] / 1000

	const geojson = useMemo(
		() => ({
			type: 'FeatureCollection',
			features: [...points, linestring],
		}),
		[points, linestring]
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
				setPoints((points) => points.filter((p) => p.properties.id !== id))
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
			setRoute(json)
		}
		fetchBikeRoute(points)
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
