import { useEffect } from 'react'
import { getFetchUrlBase } from '../serverUrls'
import { safeRemove } from './utils'

const point = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [0, 0],
			},
		},
	],
}
export default function useDrawPanoramaxPosition(map, position) {
	console.log('yellow', position)
	const hasPosition = position != null
	console.log('purple', hasPosition)
	useEffect(() => {
		if (!map || !hasPosition) return
		const addIcon = async () => {
			const image = await map.loadImage(
				getFetchUrlBase() + '/panoramax-marker.png'
			)
			map.addImage('panoramax-marker', image.data)
			map.addSource('panoramax-marker', {
				type: 'geojson',
				data: null,
			})
			map.addLayer({
				id: 'panoramax-marker',
				type: 'symbol',
				source: 'panoramax-marker',
				layout: {
					'icon-image': 'panoramax-marker',
					'icon-size': 0.15,
				},
			})
		}
		addIcon()

		return () => {
			safeRemove(map)(['panoramax-marker'], ['panoramax-marker'])
		}
	}, [map, hasPosition])

	useEffect(() => {
		if (!map || !position) return

		const source = map.getSource('panoramax-marker')
		console.log('yellow source', source)
		if (!source) return

		point.features[0].geometry.coordinates = [
			position.longitude,
			position.latitude,
		]
		source.setData(point) //TODO can't make it update, not recreate point

		map.setLayoutProperty('panoramax-marker', 'icon-rotate', position.angle)
	}, [map, position])
}
