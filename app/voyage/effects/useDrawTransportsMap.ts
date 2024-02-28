import { useEffect, useState } from 'react'
import useDrawTransport from './useDrawTransport'

export default function useDrawTransportsMap(
	map,
	active,
	center,
	safeStyleKey,
	setTempStyle,
	day
) {
	const [data, setData] = useState(null)
	useEffect(() => {
		if (!map || !active) return

		setTempStyle('transit')
		return () => {
			setTempStyle(null)
		}
	}, [setTempStyle, active, map])
	useEffect(() => {
		if (!active || !center || !day) return

		const doFetch = async () => {
			const [longitude, latitude] = center
			const format = 'geojson'
			const response = await fetch(
				//'https://motis.cartes.app/gtfs/stopTimes/' + stopId,

				`http://localhost:3000/agencyArea/${latitude}/${longitude}/${format}?day=${day.replace(
					/-/g,
					''
				)}`,
				{ mode: 'cors' }
			)
			const json = await response.json()

			setData(json)
		}
		doFetch()
	}, [setData, center, active, day])

	useDrawTransport(
		map,
		{ routesGeojson: data },
		safeStyleKey,
		'transitMap' + center?.join('|') + day,
		day
	)
	console.log('forestgreen map', data)
	return data
}
