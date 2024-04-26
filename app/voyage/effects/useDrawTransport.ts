import useSetSearchParams from '@/components/useSetSearchParams'
import { useEffect } from 'react'

const mergeRoutes = (geojson) => {
	// TODO I can't yet understand why so many geojsons for one route, and how to
	// draw them correctly.
	// Iterating on client for now, then will be cached on the server
	const { features: rawFeatures } = geojson

	const reduced = rawFeatures.reduce((memo, next) => {
		const id = next.properties.route_id
		const already = memo[id]
		return { ...memo, [id]: [...(already || []), next] }
	}, {})

	const features = Object.entries(reduced)
		.map(
			([id, list]) =>
				Array.isArray(list) && {
					...list[0],
					geometry: {
						type: 'LineString',
						coordinates: list
							.slice(0, 1)
							.map((el) => el.geometry.coordinates)
							.flat(),
					},
				}
		)
		.filter(Boolean)

	return { ...geojson, features }
}
/***
 * This hook draws transit lines on the map.
 */
export default function useDrawTransport(map, data, styleKey, drawKey) {
	const routesGeojson = data?.routesGeojson

	const setSearchParams = useSetSearchParams()

	useEffect(() => {
		if (!map || !routesGeojson) return
		if (styleKey !== 'transit') return

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
		const featureCollection =
			routesGeojson.type === 'FeatureCollection'
				? mergeRoutes(routesGeojson)
				: routesGeojson.reduce(
						(memo, next) => ({
							type: 'FeatureCollection',
							features: [
								...memo.features,
								...(next.shapes?.features || next.features),
								...(next.stops?.features.map((f) => ({
									...f,
									properties: { route_color: '#' + next.route.route_color },
								})) || []),
							],
						}),
						{ features: [] }
				  )
		const id = 'transport-routes-' + drawKey
		const linesId = id + '-lines'
		const pointsId = id + '-points'
		console.log('darkblue', drawKey)
		try {
			const source = map.getSource(id)
			if (source) return
			map.addSource(id, { type: 'geojson', data: featureCollection })

			map.addLayer({
				source: id,
				type: 'line',
				id: linesId,
				filter: ['all', ['in', '$type', 'LineString'], ['has', 'route_color']],
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					// In Rennes, one crazy bus network is the football stadium route, code E4
					// Since the agency did not give it colors, it's hard to draw it on a map
					// Moreover, it should be handled as an exceptional bus, not a regular one
					// This is easy to check through the data, see that it runs only on selected
					// days / hours and display it to the user TODO
					'line-color': ['get', 'route_color'],
					'line-opacity': ['get', 'opacity'],
					'line-width': [
						'let',
						'importance',
						['match', ['get', 'route_type'], 0, 1.6, 1, 2.6, 2, 3, 3, 0.8, 0.8],
						[
							'interpolate',
							['linear', 1],
							['zoom'],
							3,
							['*', ['var', 'importance'], 0.2],
							12,
							['*', ['var', 'importance'], 2.5],
							18,
							['*', ['var', 'importance'], 4],
						],
					],
				},
			})
			map.addLayer({
				source: id,
				type: 'circle',
				id: pointsId,
				filter: ['in', '$type', 'Point'],
				paint: {
					'circle-radius': [
						'interpolate',
						['linear', 1],
						['zoom'],
						0,
						['*', 10, ['get', 'width']],
						12,
						['*', 20, ['get', 'width']],
						18,
						['*', 50, ['get', 'width']],
					],
					'circle-stroke-width': [
						'interpolate',
						['linear', 1],
						['zoom'],
						0,
						['*', 2, ['get', 'width']],
						12,
						['*', 5, ['get', 'width']],
						18,
						['*', 10, ['get', 'width']],
					],
					'circle-stroke-color': ['get', 'circle-stroke-color'],

					'circle-pitch-alignment': 'map',
					'circle-color': ['get', 'circle-color'],
				},
			})
			console.log('darkBlue did add layer id ', pointsId, map._mapId)

			map.on('click', linesId, (e) => {
				setSearchParams({
					routes: e.features
						.map((feature) => feature.properties.routeId)
						.join('|'),
				})
			})
			map.on('click', pointsId, (e) => {
				console.log('click', e)
				const feature = e.features[0],
					stopId = feature.properties.stopId,
					gare = stopId.split('-').slice(-1)[0]

				setSearchParams({
					gare,
				})
			})

			map.on('mouseenter', linesId, () => {
				map.getCanvas().style.cursor = 'pointer'
			})
			// Change it back to a pointer when it leaves.
			map.on('mouseleave', linesId, () => {
				map.getCanvas().style.cursor = 'auto'
			})
		} catch (e) {
			console.log('Caught error drawing useDrawTransport', e)
		}

		return () => {
			console.log('darkblue', map._mapId, map.getLayersOrder())
			map.removeLayer(linesId)
			map.removeLayer(pointsId)
			const source = map.getSource(id)
			if (source) {
				map.removeSource(id)
			}
		}
	}, [map, routesGeojson, drawKey, styleKey])
}
