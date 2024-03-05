import { useEffect, useState } from 'react'
import { buildOverpassRequest } from '../effects/useOverpassRequest'

const radius = 150 // metres
const getLastPoint = (features) => features[0].geometry.coordinates.slice(-1)[0]
export default function useFetchDrawBikeParkings(map, cycling) {
	const [data, setData] = useState(null)
	const lastPoint = cycling?.features && getLastPoint(cycling.features)

	const queryCore =
		lastPoint &&
		`
  node(around:${radius}, ${lastPoint[1]}, ${lastPoint[0]})["bicycle_parking"];
		`

	useEffect(() => {
		if (!queryCore) return

		const doFetch = async () => {
			const body = buildOverpassRequest(queryCore)
			const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
				body
			)}`
			const request = await fetch(url)
			const json = await request.json()

			setData(json.elements)
		}
		doFetch()

		// search area
		//
		// overpass bbox
		// overpass query -> points
		// draw on map -> v1
	}, [queryCore, setData])

	console.log('indigo', data)
}
