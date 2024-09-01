import { useEffect, useState } from 'react'
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
	const [source, setSource] = useState()
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
			setSource(map.getSource('panoramax-marker'))
		}
		addIcon()

		return () => {
			console.log('purple return')
			setSource(null)
			safeRemove(map)(['panoramax-marker'], ['panoramax-marker'])
		}
	}, [map, hasPosition, setSource])

	useEffect(() => {
		if (!map || !source || !position) return

		point.features[0].geometry.coordinates[0] = position.longitude
		point.features[0].geometry.coordinates[1] = position.latitude

		source.setData(point) //TODO can't make it update, not recreate point. Mmmh maybe it's by design, maplibre makes it jump at high zoom, animate at lower zoom

		map.style && // dunno why it must be checked here
			map.setLayoutProperty('panoramax-marker', 'icon-rotate', position.angle)
	}, [map, source, position])
}
