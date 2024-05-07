import { useEffect, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import { findStopId, isNotTransportStop } from './stop/Stop'

export default function useTransportStopData(osmFeature, gtfsStopId) {
	const [data, setData] = useState(null)
	useEffect(() => {
		if (!gtfsStopId && (!osmFeature || !osmFeature.tags)) return
		if (!gtfsStopId && isNotTransportStop(osmFeature.tags)) return
		const stopId = gtfsStopId || findStopId(osmFeature.tags)
		const doFetch = async () => {
			const response = await fetch(gtfsServerUrl + '/stopTimes/' + stopId, {
				mode: 'cors',
			})
			const json = await response.json()

			setData({ ...json, stopId })
		}
		doFetch()
	}, [setData, osmFeature, gtfsStopId])
	if (!osmFeature && !gtfsStopId) return null
	console.log('transportStopData', data)
	return data
}
