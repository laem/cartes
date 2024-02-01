import { useEffect, useState } from 'react'
import { findStopId } from './stop/Stop'

export default function useTransportStopData(osmFeature) {
	const [data, setData] = useState(null)
	useEffect(() => {
		if (!osmFeature) return
		const stopId = findStopId(osmFeature.tags)
		const doFetch = async () => {
			const response = await fetch(
				//'https://gtfs-server.osc-fr1.scalingo.io/stopTimes/' + stopId,
				'http://localhost:3000/stopTimes/' + stopId,
				{ mode: 'cors' }
			)
			const json = await response.json()

			setData({ ...json, stopId })
		}
		doFetch()
	}, [setData, osmFeature])
	if (!osmFeature) return null
	console.log('transportStopData', data)
	return data
}
