import { useEffect } from 'react'

export default function useDrawTransport(map, data, styleKey) {
	const routesGeojson = data?.routesGeojson,
		stopId = data?.stopId

	useEffect(() => {
		if (!map || !routesGeojson) return
		console.log('onload redraw')

		/* Lower the opacity of all style layers.
		 * Replaced by setting the "dataviz" style
		 *
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
		*/
		const featureCollection = routesGeojson.reduce(
			(memo, next) =>
				console.log('ROUTE', next.route) || {
					type: 'FeatureCollection',
					features: [
						...memo.features,
						...next.shapes.features,
						...next.stops.features.map((f) => ({
							...f,
							properties: { route_color: '#' + next.route.route_color },
						})),
					],
				},
			{ features: [] }
		)
		const id = 'routes-stopId-' + stopId
		try {
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
		} catch (e) {
			console.log('Caught error drawing useDrawTransport', e)
		}

		return () => {
			try {
				map.removeLayer(id + '-lines')
				map.removeLayer(id + '-points')
				const source = map.getSource(id)
				if (source) {
					map.removeSource(id)
				}
			} catch (e) {
				console.log('Caught error undrawing useDrawTransport', e)
			}
		}
	}, [map, routesGeojson, stopId, styleKey])
}
