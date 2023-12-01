import { useEffect, useState } from 'react'
import length from '@turf/length'

export default function useMeasureDistance(map, distanceMode) {
	const [points, setPoints] = useState([])

	useEffect(() => {
		if (!map) return
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

		if (!distanceMode) {
			map.off('click', onClick)
			map.off('mousemove', onMouseMove)
			return
		}

		map.on('click', onClick)
		map.on('mousemove', onMouseMove)
		return () => {
			map.off('click', onClick)
			map.off('mousemove', onMouseMove)
		}
	}, [map, setPoints, distanceMode])

	// Used to draw a line between points
	const linestring = {
		type: 'Feature',
		properties: {},

		geometry: {
			type: 'LineString',
			coordinates: points.map((point) => {
				return point.geometry.coordinates
			}),
		},
	}
	// GeoJSON object to hold our measurement features
	const geojson = {
		type: 'FeatureCollection',
		features: [...points, linestring],
	}
	useEffect(() => {
		if (!map || !distanceMode || points.length < 1) return
		const source = map.getSource('measure-points')
		if (source) {
			console.log('set new data', geojson)
			source.setData(geojson)
		} else {
			console.log('create source and layers')
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
					'line-width': 2.5,
				},
				filter: ['in', '$type', 'LineString'],
			})
			map.addLayer({
				id: 'measure-points',
				type: 'circle',
				source: 'measure-points',
				paint: {
					'circle-radius': 5,
					'circle-color': '#2988e6',
				},
				filter: ['in', '$type', 'Point'],
			})
		}
	}, [points, geojson, map, distanceMode])

	useEffect(() => {
		if (!map || distanceMode || points.length < 1) return

		map.removeSource('measure-points')
		map.removeLayer('measure-lines')
		map.removeLayer('measure-points')
	}, [distanceMode, map, points])

	const distance = length(linestring).toLocaleString('fr-FR', {
		maximumFractionDigits: 1,
	})

	console.log(distance)
	return distance
}
