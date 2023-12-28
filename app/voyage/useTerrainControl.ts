import maplibregl from 'maplibre-gl'
import { useEffect } from 'react'

export default function useTerrainControl(map, style) {
	useEffect(() => {
		if (!map) return
		if (!style.hasTerrain) return
		const control = new maplibregl.TerrainControl({
			source: 'terrain-rgb',
			exaggeration: 1,
		})

		map.addControl(control, 'top-right')
		return () => {
			try {
				control && map.removeControl(control)
			} catch (e) {
				console.log('Trying to remove terrain 3D control failed', e)
			}
		}
	}, [map, style])
}
