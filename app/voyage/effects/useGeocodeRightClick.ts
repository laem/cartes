import { useEffect, useState } from 'react'

export default function useGeocodeRightClick(clickedPoint) {
	const [data, setData] = useState(null)
	useEffect(() => {
		if (!clickedPoint) return

		const doFetch = async () => {
			const request = await fetch(
				`https://photon.komoot.io/reverse?lon=${clickedPoint[1]}&lat=${clickedPoint[0]}`
			)
			const json = await request.json()

			setData(json)
		}
		doFetch()
	}, [clickedPoint, setData])

	const result = clickedPoint && {
		latitude: clickedPoint[0],
		longitude: clickedPoint[1],
		data,
	}

	return result
}
