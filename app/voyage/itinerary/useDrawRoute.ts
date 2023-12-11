import { useEffect } from 'react'

export default function useDrawRoute(map, bikeRoute, id) {
	useEffect(() => {
		if (!map || !bikeRoute || !bikeRoute.features || !bikeRoute.features.length)
			return

		const feature = bikeRoute.features[0]

		map.addSource(id, {
			type: 'geojson',
			data: feature,
		})
		map.addLayer({
			id: id + 'Contour',
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
			id: id,
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
		})

		return () => {
			map.removeLayer(id)
			map.removeLayer(id + 'Contour')
			map.removeSource(id)
		}
	}, [bikeRoute, map, id])
}
