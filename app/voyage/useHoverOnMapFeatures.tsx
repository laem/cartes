import { useEffect } from 'react'

export default function useHoverOnMapFeatures(map) {
	useEffect(() => {
		if (!map) return

		setUpHover(map, ['Other POI'])
	}, [map])
}

// Taken from https://github.com/zbycz/osmapp/blob/master/src/components/Map/behaviour/useInitMap.tsx
const setUpHover = (map, layersWithOsmId) => {
	let lastHover = null

	const setHoverOn = (feature) =>
		feature && map.setFeatureState(feature, { hover: true })
	const setHoverOff = (feature) =>
		feature && map.setFeatureState(feature, { hover: false })

	const onMouseMove = (e) => {
		if (e.features && e.features.length > 0) {
			const feature = e.features[0]
			if (feature !== lastHover) {
				setHoverOff(lastHover)
				setHoverOn(feature)
				lastHover = feature
				map.getCanvas().style.cursor = 'pointer' // eslint-disable-line no-param-reassign
			}
		}
	}

	const onMouseLeave = () => {
		setHoverOff(lastHover)
		lastHover = null
		// TODO delay 200ms
		map.getCanvas().style.cursor = '' // eslint-disable-line no-param-reassign
	}

	layersWithOsmId.forEach((layer) => {
		map.on('mousemove', layer, onMouseMove)
		map.on('mouseleave', layer, onMouseLeave)
	})
}
