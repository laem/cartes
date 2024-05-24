import useSetSearchParams from '@/components/useSetSearchParams'
import { useEffect, useState } from 'react'

export default function useRightClick(map, clickedPoint) {
	const setSearchParams = useSetSearchParams()
	const setClickedPoint = (clickedPoint) =>
		setSearchParams({ clic: clickedPoint.join('|') })

	const [data, setData] = useState(null)

	useEffect(() => {
		if (!map) return

		let timeout = null
		const clearClickTimeout = () => {
			clearTimeout(timeout)
		}

		map.on('contextmenu', (e) => {
			const { lat: latitude, lng: longitude } = e.lngLat
			setClickedPoint({ latitude, longitude })
		})
		map.on('touchstart', (e) => {
			if (e.originalEvent.touches.length > 1) {
				return
			}
			timeout = setTimeout(() => {
				const { lat: latitude, lng: longitude } = e.lngLat
				setClickedPoint({ latitude, longitude })
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

	useEffect(() => {
		if (!clickedPoint) return

		const doFetch = async () => {
			const request = await fetch(
				`https://photon.komoot.io/reverse?lon=${clickedPoint.longitude}&lat=${clickedPoint.latitude}`
			)
			const json = await request.json()

			setData(json)
		}
		doFetch()
	}, [clickedPoint, setData])

	const result = clickedPoint && { ...clickedPoint, data }

	return [result, () => setClickedPoint(null)]
}
