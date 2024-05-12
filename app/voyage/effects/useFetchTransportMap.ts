import { useEffect, useMemo, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import useDrawTransport from './useDrawTransport'
import { filterTransportFeatures } from '../transport/filterTransportFeatures'
import { decodeTransportsData } from '../transport/decodeTransportsData'
import { omit } from '@/components/utils/utils'

export default function useFetchTransportMap(
	map,
	active,
	safeStyleKey,
	setTempStyle,
	day,
	bbox,
	agence,
	routesParam,
	stop,
	trainType,
	transitFilter,
	noCache
) {
	const [data, setData] = useState([])
	useEffect(() => {
		if (!active || !bbox) return

		const abortController = new AbortController()
		const doFetch = async () => {
			const [[longitude2, latitude], [longitude, latitude2]] = bbox

			const url = (format) =>
				`${gtfsServerUrl}/agencyArea/${latitude}/${longitude}/${latitude2}/${longitude2}/${format}/`

			try {
				const request = await fetch(url('prefetch'), {
					mode: 'cors',
					signal: abortController.signal,
				})
				const relevantAgencyIds = await request.json()

				const cacheAgencyIds = data.map(([id]) => id),
					newAgencyIds = relevantAgencyIds.filter(
						(id) => !cacheAgencyIds.includes(id)
					)

				if (!newAgencyIds.length)
					return setData(
						data.filter(([agency]) => relevantAgencyIds.includes(agency))
					)

				const dataRequest = await fetch(
					url('geojson') +
						(agence || newAgencyIds.join('|')) +
						(noCache ? `?noCache=${noCache}` : ''),
					{
						mode: 'cors',
						signal: abortController.signal,
					}
				)

				const dataJson = await dataRequest.json()

				const newAgencies = dataJson.map(decodeTransportsData)
				if (noCache) {
					setData(newAgencies)
				} else
					setData([
						...data.filter(
							([id]) =>
								relevantAgencyIds.includes(id) && !newAgencyIds.includes(id)
						),
						...newAgencies,
					])
			} catch (e) {
				if (abortController.signal.aborted) {
					console.log(
						"Requête précédente annulée, sûrement suite à un changement de bbox avant que la requête n'ait eu le temps de finir"
					)
				} else {
					console.error(e)
				}
			}
		}
		doFetch()
		return () => {
			abortController.abort()
		}
	}, [setData, bbox, active, day, agence, noCache])

	return active ? data : null
}
