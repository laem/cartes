import { useEffect } from 'react'

export default function useDrawTransit(map, transit, selectedConnection) {
	const connection =
		transit?.connections && transit.connections[selectedConnection]

	useEffect(() => {
		if (!map || !connection) return

		const { transports, stops } = connection

		console.log('yotr', transports)
		const featureCollection = {
			type: 'FeatureCollection',
			features: transports.reduce(
				(memo, next) => [
					...memo,
					{
						type: 'Feature',
						properties: {
							route_color: next.route_color,
							route_text_color: next.route_text_color,
						},
						geometry: {
							type: 'LineString',
							coordinates: stops
								.slice(next.move.range.from, next.move.range.to + 1)
								.map((stop) => [stop.station.pos.lng, stop.station.pos.lat]),
						},
					},
				],
				[]
			),
		}
		console.log(featureCollection)
		const id = 'transit-' + Math.random()

		const source = map.getSource(id)
		if (source) return
		console.log('will (re)draw transport route geojson')
		map.addSource(id, { type: 'geojson', data: featureCollection })

		map.addLayer({
			source: id,
			type: 'line',
			id: id + '-lines',
			filter: ['in', '$type', 'LineString'],
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': ['get', 'route_color'],
				'line-width': [
					'interpolate',
					['linear', 1],
					['zoom'],
					3,
					0.2,
					12,
					2.5,
					18,
					4,
				],
			},
		})
		map.addLayer({
			source: id,
			type: 'circle',
			id: id + '-points',
			filter: ['in', '$type', 'Point'],
			paint: {
				'circle-radius': [
					'interpolate',
					['linear', 1],
					['zoom'],
					0,
					0.1,
					12,
					1,
					18,
					10,
				],
				'circle-color': 'white',
				'circle-pitch-alignment': 'map',
				'circle-stroke-color': ['get', 'route_color'],
				'circle-stroke-width': [
					'interpolate',
					['linear', 1],
					['zoom'],
					0,
					0.1,
					12,
					1,
					18,
					4,
				],
			},
		})

		return () => {
			map.removeLayer(id + '-lines')
			map.removeLayer(id + '-points')
			const source = map.getSource(id)
			if (source) {
				map.removeSource(id)
			}
		}
	}, [map, connection])
}
