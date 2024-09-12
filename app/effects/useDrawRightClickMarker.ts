import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'

export default function useDrawRightClickMarker(map, geocodedClickedPoint) {
	useEffect(() => {
		if (!map || !geocodedClickedPoint) return

		console.log('lightgreen marker', geocodedClickedPoint)

		const lon = geocodedClickedPoint.longitude,
			lat = geocodedClickedPoint.latitude

		if (!lon || !lat) return
		const marker = new Marker({
			color: 'var(--color)',
			//draggable: true,
		})
			.setLngLat([lon, lat])
			.addTo(map)

		return () => {
			marker.remove()
		}
	}, [map, geocodedClickedPoint])
}
