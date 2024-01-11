import { useEffect } from 'react'

export default function useDrawRoute(itineraryMode, map, geojson, id) {
	console.log('geojson udR', geojson)
	useEffect(() => {
		if (map) console.log('getsource', id, map._mapId, map.getSource(id))
		if (
			!itineraryMode ||
			!map ||
			!geojson ||
			!geojson.features ||
			!geojson.features.length
		)
			return undefined
		console.log('will draw useDrawRoute inside ' + id, id, geojson)

		map.addSource(id, {
			type: 'geojson',
			data: geojson,
		})

		if (map) console.log('getsource2', id, map.getSource(id))
		console.log('useDrawRoute did add source')
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
		console.log(
			'useDrawRoute did add layers',
			map._mapId,
			map.getLayer(id + 'Points')
		)

		return () => {
			console.log(
				'will remove useDrawRoute' + id,
				map._mapId,
				map.getLayer(id + 'Points')
			)

			map.removeLayer(id + 'Line')
			map.removeLayer(id + 'Contour')
			map.removeLayer(id + 'Points')
			map.removeSource(id)
		}
	}, [itineraryMode, geojson, map, id])
}
