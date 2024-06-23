import { useEffect } from 'react'
import { safeRemove } from '../effects/utils'

/*
 * Draws the walk or cycle route provided by BRouter directly as Geojson
 * */
export default function useDrawCyclingSegments(isItineraryMode, map, geojson) {
	useEffect(() => {
		if (
			!isItineraryMode ||
			!map ||
			!geojson ||
			!geojson.features ||
			!geojson.features.length
		)
			return undefined

		const id = 'cyclingSegments'
		const source = map.getSource(id)

		if (!source)
			map.addSource(id, {
				type: 'geojson',
				data: geojson,
			})

		map.addLayer(
			{
				id: id + 'SecureCycling',
				type: 'line',
				source: id,
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': 'LightSeaGreen',
					'line-width': 2.5,
					'line-offset': 5,
				},
				filter: ['==', ['get', 'isSafePath'], 'oui'],
			},
			'distance' + 'Points'
		)

		return () => {
			// There's something I don't understand in MapLibre's lifecycle...
			// "this.style is undefined" when redimensioning the browser window, need
			// to catch it
			// We're operating on a stale style / map
			if (!map) return
			try {
				console.log('will try to remove source and layers id ', id)
				safeRemove(map)([id + 'SecureCycling'], [id])
			} catch (e) {
				console.log('Could not remove useDrawRoute layers or source', e)
			}
		}
	}, [isItineraryMode, geojson, map])
}
