import { useEffect, useMemo, useState } from 'react'
import useDrawTransport from './useDrawTransport'

export default function useDrawTransportsMap(
	map,
	active,
	safeStyleKey,
	setTempStyle,
	day,
	bbox
) {
	const [data, setData] = useState(null)
	console.log('purple bbox', bbox)
	useEffect(() => {
		if (!map || !active) return

		setTempStyle('transit')
		return () => {
			setTempStyle(null)
		}
	}, [setTempStyle, active, map])
	useEffect(() => {
		if (!active || !day || !bbox) return

		const doFetch = async () => {
			const [[longitude2, latitude], [longitude, latitude2]] = bbox

			const format = 'geojson'
			const response = await fetch(
				//'https://motis.cartes.app/gtfs/stopTimes/' + stopId,

				`http://localhost:3000/agencyArea/${latitude}/${longitude}/${latitude2}/${longitude2}/${format}?day=${day.replace(
					/-/g,
					''
				)}`,
				{ mode: 'cors' }
			)
			const json = await response.json()

			setData(json)
		}
		doFetch()
	}, [setData, bbox, active, day])

	useDrawTransport(
		map,
		{ routesGeojson: data?.map(([agencyId, { geojson }]) => geojson) },
		safeStyleKey,
		'transitMap' + JSON.stringify(bbox) + day,
		day
	)
	console.log('forestgreen map', data)
	return data
}
