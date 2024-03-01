import { useEffect, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import { findStopId, isNotTransportStop } from './stop/Stop'

export default function useTransportStopData(osmFeature) {
	const [data, setData] = useState(null)
	useEffect(() => {
		if (!osmFeature || !osmFeature.tags) return
		if (isNotTransportStop(osmFeature.tags)) return
		const stopId = findStopId(osmFeature.tags)
		const doFetch = async () => {
			const response = await fetch(gtfsServerUrl + '/stopTimes/' + stopId, {
				mode: 'cors',
			})
			const json = await response.json()

			setData({ ...json, stopId })
		}
		doFetch()
	}, [setData, osmFeature])
	if (!osmFeature) return null
	console.log('transportStopData', data)
	return data
}
