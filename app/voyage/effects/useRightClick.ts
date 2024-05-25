import useSetSearchParams from '@/components/useSetSearchParams'
import { useEffect, useState } from 'react'

export default function useRightClick(map) {
	const setSearchParams = useSetSearchParams()
	const setClickedPoint = (clickedPoint) =>
		setSearchParams({
			clic: clickedPoint.map((coordinate) => coordinate.toFixed(4)).join('|'),
		})

	useEffect(() => {
		if (!map) return

		let timeout = null
		const clearClickTimeout = () => {
			clearTimeout(timeout)
		}

		map.on('contextmenu', (e) => {
			const { lat: latitude, lng: longitude } = e.lngLat
			setClickedPoint([latitude, longitude])
		})
		map.on('touchstart', (e) => {
			if (e.originalEvent.touches.length > 1) {
				return
			}
			timeout = setTimeout(() => {
				const { lat: latitude, lng: longitude } = e.lngLat
				setClickedPoint([latitude, longitude])
			}, 500)
		})

		map.on('touchend', clearClickTimeout)
		map.on('touchcancel', clearClickTimeout)
		map.on('touchmove', clearClickTimeout)
		map.on('pointerdrag', clearClickTimeout)
		map.on('pointermove', clearClickTimeout)
		map.on('moveend', clearClickTimeout)
		map.on('gesturestart', clearClickTimeout)
		map.on('gesturechange', clearClickTimeout)
		map.on('gestureend', clearClickTimeout)
	}, [map, setClickedPoint])
}
