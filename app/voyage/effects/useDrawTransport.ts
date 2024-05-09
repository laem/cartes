import useSetSearchParams from '@/components/useSetSearchParams'
import { useEffect } from 'react'

/***
 * This hook draws transit lines on the map.
 */
export default function useDrawTransport(map, features, styleKey, drawKey) {
	console.log('indigo features', features, drawKey)
	const setSearchParams = useSetSearchParams()

	useEffect(() => {
		if (!map || !features?.length) return
		if (styleKey !== 'transit') return

		/* Old idea : lower the opacity of all style layers.
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
		// TODO this is overly complicated
		const featureCollection = {
			type: 'FeatureCollection',
			features,
		}

		const id = 'transport-routes-' + drawKey
		const linesId = id + '-lines'
		const pointsId = id + '-points'

		const onClickRoutes = (e) => {
			console.log(
				'purple',
				e.features.map(
					({ properties }) =>
						properties.route_long_name + '   ' + properties.sncfTrainType
				)
			)

			setSearchParams({
				routes: e.features
					.map((feature) => feature.properties.route_id)
					.join('|'),
			})
		}
		const onClickStop = (e) => {
			console.log('purple stop', e.features)
			const feature = e.features[0],
				agence = feature.properties.agencyId,
				arret = feature.properties.name
			//stopId = feature.properties.id,
			//, gare = stopId.split('-').slice(-1)[0]

			setSearchParams({
				agence,
				arret,
			})
		}
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
						'interpolate',
						['linear', 1],
						['zoom'],
						3,
						['*', ['get', 'width'], 0.2],
						12,
						['*', ['get', 'width'], 2.5],
						18,
						['*', ['get', 'width'], 4],
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
						['*', 0.1, ['get', 'width']],
						6,
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
						['*', 0.1, ['get', 'width']],
						6,
						['*', 3, ['get', 'width']],
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

			map.on('click', linesId, onClickRoutes)
			map.on('click', pointsId, onClickStop)

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
			map.off('click', linesId, onClickRoutes)
			map.off('click', pointsId, onClickStop)
			map.removeLayer(linesId)
			map.removeLayer(pointsId)
			const source = map.getSource(id)
			if (source) {
				map.removeSource(id)
			}
		}
	}, [map, features, drawKey, styleKey])
}
