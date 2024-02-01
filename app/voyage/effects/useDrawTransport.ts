import { useEffect } from 'react'

export default function useDrawTransport(map, data) {
	const shapes = data?.shapes,
		stopId = data?.stopId
	console.log('SHAPES', shapes, data)

	useEffect(() => {
		if (!map || !shapes) return
		const layerIds = map.getLayersOrder()
		layerIds.map((layerId) => {
			if (layerId.startsWith('routes-stopId-')) return
			const layer = map.getLayer(layerId)
			const property =
				layer.type === 'fill'
					? ['fill-opacity']
					: layer.type === 'background'
					? ['background-opacity']
					: layer.type === 'line'
					? ['line-opacity']
					: layer.type === 'symbol'
					? ['text-opacity', 'icon-opacity']
					: null
			if (property) property.map((p) => map.setPaintProperty(layerId, p, 0.3))
		})
		const featureCollection = shapes.reduce(
			(memo, next) => ({
				type: 'FeatureCollection',
				features: [...memo.features, ...next.features],
			}),
			{ features: [] }
		)
		const id = 'routes-stopId-' + stopId
		const source = map.getSource(id)
		if (source) return
		map.addSource(id, { type: 'geojson', data: featureCollection })

		map.addLayer({
			id: id,
			type: 'line',
			source: id,
			filter: ['in', '$type', 'LineString'],
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': ['get', 'route_color'],
				'line-width': 3,
			},
		})

		return () => {
			if (!map || !map.isStyleLoaded()) return
			map.removeLayer(id)
			map.removeSource(id)
		}
	}, [map, shapes, stopId])
}
