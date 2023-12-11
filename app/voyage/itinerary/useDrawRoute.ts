import { useEffect } from 'react'

export default function useDrawRoute(map, features, id) {
	useEffect(() => {
		console.log('bikeRoute', features)
		if (!map || !features || !features.features || !features.features.length)
			return

		map.addSource(id, {
			type: 'geojson',
			data: features,
		})
		map.addLayer({
			id: id + 'Contour',
			type: 'line',
			source: id,
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#5B099F',
				'line-width': 8,
			},
			filter: ['in', '$type', 'LineString'],
		})
		map.addLayer({
			id: id + 'Line',
			type: 'line',
			source: id,
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': '#B482DD',
				'line-width': 5,
			},
			filter: ['in', '$type', 'LineString'],
		})
		map.addLayer({
			id: id + 'Points',
			type: 'circle',
			source: id,
			paint: {
				'circle-radius': 6,
				'circle-color': '#2988e6',
			},
			filter: ['in', '$type', 'Point'],
		})

		return () => {
			map.removeLayer(id + 'Line')
			map.removeLayer(id + 'Contour')
			map.removeLayer(id + 'Points')
			map.removeSource(id)
		}
	}, [features, map, id])
}
