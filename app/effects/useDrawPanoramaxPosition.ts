import { useEffect } from 'react'
import { getFetchUrlBase } from '../serverUrls'
import { safeRemove } from './utils'

export default function useDrawPanoramaxPosition(map, position) {
	useEffect(() => {
		if (!map || !position) return
		console.log('panoramax position from draw', position)
		const addIcon = async () => {
			const image = await map.loadImage(
				getFetchUrlBase() + '/panoramax-marker.png'
			)
			map.addImage('panoramax-marker', image.data)
			map.addSource('panoramax-marker', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [position.longitude, position.latitude],
							},
						},
					],
				},
			})
			map.addLayer({
				id: 'panoramax-marker',
				type: 'symbol',
				source: 'panoramax-marker',
				layout: {
					'icon-image': 'panoramax-marker',
					'icon-size': 0.05,
				},
			})
		}
		addIcon()

		return () => {
			safeRemove(map)(['panoramax-marker'], ['panoramax-marker'])
		}
	}, [map, position])
}
