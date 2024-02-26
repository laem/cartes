import { useEffect } from 'react'

/***
 * This hook draws transit lines on the map.
 */
export default function useDrawTransport(map, data, styleKey) {
	const rawRoutesGeojson = data?.routesGeojson,
		stopId = data?.stopId

	// In Rennes, one crazy bus network is the football stadium route, code E4
	// Since the agency did not give it colors, it's hard to draw it on a map
	// Moreover, it should be handled as an exceptional bus, not a regular one
	// This is easy to check through the data, see that it runs only on selected
	// days / hours and display it to the user TODO
	const routesGeojson = rawRoutesGeojson?.filter(
		({ route }) => route.route_color
	)

	useEffect(() => {
		if (!map || !routesGeojson) return
		console.log('onload redraw')

		/* Lower the opacity of all style layers.
		 * Replaced by setting the "transit" style taken from MapTiler's dataviz
		 * clean styl, but we're losing essential
		 * things like POIs, might be interesting to consider this option, or
		 * alternatively make the dataviz style better
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
