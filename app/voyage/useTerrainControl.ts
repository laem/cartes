import maplibregl from 'maplibre-gl'
import { useEffect } from 'react'

export default function useTerrainControl(map, style) {
	useEffect(() => {
		if (!map) return
		if (!style.hasTerrain) return
		const control = map.addControl(
			new maplibregl.TerrainControl({
				source: 'terrain-rgb',
				exaggeration: 1,
			}),
			'top-right'
		)
		return () => {
			control && map.removeControl(control)
		}
	}, [map, style])
}
