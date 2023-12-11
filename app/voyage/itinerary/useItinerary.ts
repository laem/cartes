import { useEffect, useMemo, useState } from 'react'
import length from '@turf/length'

export default function useMeasureDistance(map, itineraryMode) {
	const [points, setPoints] = useState([])
	const [route, setRoute] = useState(null)
	const bikeRouteProfile = 'safety'

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
	const rawDistance = linestring.properties['track-length']
	useEffect(() => {
		if (!map || !itineraryMode) return

		const onClick = (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['measure-points'],
			})

			// If a feature was clicked, remove it from the map
			if (features.length) {
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

				setPoints((points) => [...points, point])
			}
		}
		const onMouseMove = (e) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['measure-points'],
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
	}, [map, setPoints, itineraryMode])

	useEffect(() => {
		if (points.length < 2) return undefined
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
	}, [points, setRoute])
	// GeoJSON object to hold our measurement features
	const geojson = useMemo(
		() => ({
			type: 'FeatureCollection',
			features: [...points, linestring],
		}),
		[points, linestring]
	)
	useEffect(() => {
		if (!map || !itineraryMode) return
		const source = map.getSource('measure-points')
		if (source) {
			source.setData(geojson)
		} else {
			map.addSource('measure-points', {
				type: 'geojson',
				data: geojson,
			})
			// Add styles to the map
			map.addLayer({
				id: 'measure-lines',
				type: 'line',
				source: 'measure-points',
				layout: {
					'line-cap': 'round',
					'line-join': 'round',
				},
				paint: {
					'line-color': '#57bff5',
					'line-width': 4,
				},
				filter: ['in', '$type', 'LineString'],
			})
			map.addLayer({
				id: 'measure-points',
				type: 'circle',
				source: 'measure-points',
				paint: {
					'circle-radius': 6,
					'circle-color': '#2988e6',
				},
				filter: ['in', '$type', 'Point'],
			})
		}
	}, [points, geojson, map, itineraryMode])

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
	return [distance, resetDistance]
}
