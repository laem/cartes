import { useEffect } from 'react'
import { safeRemove } from './utils'

const id = 'transport-areas'
const areasId = id + '-fill'
const bordersId = id + '-border'
export default function useDrawTransportAreas(map, areas) {
	useEffect(() => {
		if (!map || !areas) return

		//const areaKm2 = area(bboxPolygon(bbox)) / 1000000
		//if (areaKm2 > 3000) return

		const data = {
			type: 'FeatureCollection',
			features: Object.entries(areas)
				.map(([id, polygon]) => polygon)
				.filter(Boolean),
		}

		console.log('orange areas', areas, data)
		map.addSource(areasId, { type: 'geojson', data })
		map.addLayer({
			source: areasId,
			type: 'fill',
			id: areasId,
			paint: { 'fill-color': '#57bff5', 'fill-opacity': 0.1 },
		})
		map.addLayer({
			source: areasId,
			type: 'line',
			id: bordersId,
			paint: { 'line-color': '#57bff5', 'line-opacity': 0.3, 'line-width': 1 },
		})
		return () => {
			safeRemove(map)([areasId, bordersId], [id])
		}
	}, [map, areas])
}
