import getBbox from '@turf/bbox'
import { useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { fitBoundsConsideringModal } from '../utils'
import { computeSlopeGradient } from './computeSlopeGradient'
import { safeRemove } from '../effects/utils'

/*
 * Draws the walk or cycle route provided by BRouter directly as Geojson
 * */
export default function useDrawRoute(isItineraryMode, map, geojson, id) {
	const isMobile = useMediaQuery('(max-width: 800px)')

	useEffect(() => {
		if (
			!isItineraryMode ||
			!map ||
			!geojson ||
			!geojson.features ||
			!geojson.features.length
		)
			return undefined
		console.log('will draw useDrawRoute inside ' + id, id, geojson)

		const source = map.getSource(id)
		if (!source)
			map.addSource(id, {
				type: 'geojson',
				data: geojson,
				lineMetrics: true,
			})

		console.log('useDrawRoute did add source')

		map.addLayer({
			id: id + 'PointsSymbols',
			type: 'symbol',
			source: id,
			filter: ['in', '$type', 'Point'],
			paint: {
				'text-color': '#ffffff', //makes the whole drawing fail...
			},
			layout: {
				'text-field': ['get', 'letter'],
				//				'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
				'text-size': 16,
			},
		})
		console.log('will add layer poinst', id + 'Points')
		map.addLayer(
			{
				id: id + 'Points',
				type: 'circle',
				source: id,
				paint: {
					'circle-radius': 12,
					'circle-color': '#2988e6',
					'circle-stroke-color': '#ffffff',
					'circle-stroke-width': 3,
				},
				filter: ['in', '$type', 'Point'],
			},
			id + 'PointsSymbols'
		)

		map.addLayer(
			{
				id: id + 'Line',
				type: 'line',
				source: id,
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					walking: {
						'line-color': '#8f53c1',
						'line-width': 5,
						// I'm bricoling something here but I don't understand yet how it
						// works precisely
						'line-dasharray': {
							stops: [
								[0, [10, 2]],
								[10, [3, 2]],
								[16, [0.6, 2]],
							],
						},
					},
					distance: {
						'line-width': 0,
					},
					cycling: {
						'line-color': '#57bff5',
						'line-width': 2,
						...(id === 'cycling'
							? {
									'line-gradient': [
										'interpolate',
										['linear'],
										['line-progress'],
										...computeSlopeGradient(geojson),
									],
							  }
							: {}),
					},
				}[id],
				filter: ['in', '$type', 'LineString'],
			},
			'distance' + 'Points'
		)
		if (id === 'cycling')
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
						'line-color': 'SeaGreen',
						'line-width': 3,
						'line-offset': 5,
					},
					filter: ['in', '$type', 'LineString'],
				},
				'distance' + 'Points'
			)
		map.addLayer(
			{
				id: id + 'Contour',
				type: 'line',
				source: id,
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					walking: {
						'line-color': '#5B099F',
						'line-width': 0, // I wasn't able to make a dasharray contour
					},
					distance: {
						'line-width': 2,
						'line-color': '#185abd60',
						'line-dasharray': [8, 8],
					},
					cycling: {
						'line-color': '#5B099F',
						'line-width': 4,
					},
				}[id],
				filter: ['in', '$type', 'LineString'],
			},
			'distance' + 'Line'
		)

		const bbox = getBbox(geojson)

		if (
			geojson.features.filter(
				(f) => f.geometry.type === 'Point' && f.properties.key != null
			).length > 1
		)
			fitBoundsConsideringModal(isMobile, bbox, map)

		return () => {
			// There's something I don't understand in MapLibre's lifecycle...
			// "this.style is undefined" when redimensioning the browser window, need
			// to catch it
			// We're operating on a stale style / map
			if (!map) return
			try {
				const baseId = id
				console.log('will try to remove source and layers id ', id)
				safeRemove(map)(
					[
						baseId + 'Line',
						baseId + 'Contour',
						baseId + 'Points',
						baseId + 'PointsSymbols',
						baseId + 'SecureCycling',
					],
					[baseId]
				)
			} catch (e) {
				console.log('Could not remove useDrawRoute layers or source', e)
			}
		}
	}, [isItineraryMode, geojson, map, id])
}
