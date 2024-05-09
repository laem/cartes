import { useEffect, useMemo, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import useDrawTransport from './useDrawTransport'
import { filterTransportFeatures } from '../transport/filterTransportFeatures'
import { decodeTransportsData } from '../transport/decodeTransportsData'

export default function useDrawTransportsMap(
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
		if (!map || !active) return

		setTempStyle('transit')
		return () => {
			setTempStyle(null)
		}
	}, [setTempStyle, active, map])

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
				const json = await request.json()

				const agencies = data.map(([id]) => id),
					newAgencies = json.filter((agency) => !agencies.includes(agency))

				if (!newAgencies.length) return

				const dataRequest = await fetch(
					url('geojson') +
						(agence || newAgencies.join('|')) +
						(noCache ? `?noCache=${noCache}` : ''),
					{
						mode: 'cors',
						signal: abortController.signal,
					}
				)

				const dataJson = await dataRequest.json()

				console.log('plop 1', dataJson)
				const decoded = dataJson.map(decodeTransportsData)
				console.log('plop 2', decoded)
				if (noCache) {
					setData(decoded)
				} else setData([...data, ...decoded])
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

	const drawData = useMemo(() => {
		console.log('memo', data)
		return data
			.map(([, { features }]) => {
				const filteredFeatures = filterTransportFeatures(features, {
					routesParam,
					stop,
					trainType,
					transitFilter,
				})
				return filteredFeatures
			})
			.flat()
	}, [data, routesParam, stop, trainType, transitFilter])

	useDrawTransport(
		map,
		drawData,
		safeStyleKey,
		'transitMap' // + (data || []).map(([id]) => id) + (day || ''), // TODO When the selection of agencies will change, the map will redraw, which is a problem : only new agencies should be added
		// See https://github.com/laem/futureco/pull/226
	)
	return data
}
