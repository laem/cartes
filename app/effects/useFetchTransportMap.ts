import { filterMapEntries } from '@/components/utils/utils'
import { useEffect, useMemo, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import { decodeTransportsData } from '../transport/decodeTransportsData'

export function useFetchAgencyAreas(active) {
	const [agencyAreas, setAgencyAreas] = useState()
	useEffect(() => {
		if (!active) return

		const doFetch = async () => {
			const url = `${gtfsServerUrl}/agencyAreas`

			const request = await fetch(url)
			const json = await request.json()

			setAgencyAreas(json)
		}
		doFetch()
	}, [active, setAgencyAreas])

	return (
		agencyAreas &&
		filterMapEntries(agencyAreas, (id, v) => filterRejectPlaneAgency([id]))
	)
}

export default function useFetchTransportMap(
	active,
	day,
	bbox,
	agence,
	noCache,
	fetchAll,
	givenAgencyEntry
) {
	const [data, setData] = useState(givenAgencyEntry ? [givenAgencyEntry] : [])

	useEffect(() => {
		if (!active || agence == null) return
		if (data.find(([agencyId]) => agencyId === agence)) return

		const doFetch = async () => {
			const url = `${gtfsServerUrl}/agencyArea/${agence}`

			const request = await fetch(url)
			const json = await request.json()

			const newAgencies = [[agence, json]].map(decodeTransportsData)

			setData((data) => [...data, ...newAgencies])
		}
		doFetch()
	}, [agence, data, active, setData])

	useEffect(() => {
		if (!active || !fetchAll) return

		const doFetch = async () => {
			const url = `${gtfsServerUrl}/agencies`

			const request = await fetch(url)
			const json = await request.json()

			const newAgencies = Object.entries(json).map(decodeTransportsData)

			// filter all national lines
			const filtered = rejectNationalAgencies(newAgencies)
			setData(filtered)
		}
		doFetch()
	}, [active, fetchAll, setData])
	useEffect(() => {
		if (!active || !bbox || fetchAll) return
		if (agence != null) return

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

				if (!newAgencyIds.length) {
					return setData(
						data.filter(([agency]) => relevantAgencyIds.includes(agency))
					)
				}

				// TODO if agence, don't bother with the matching bbox, we just want to
				// show the line infos quickly and zoom the map on the relevant zone
				const dataRequest = await fetch(
					url('geojson') +
						newAgencyIds.join('|') +
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
				} else {
					const newData = [
						...data.filter(
							([id]) =>
								relevantAgencyIds.includes(id) && !newAgencyIds.includes(id)
						),
						...newAgencies,
					]
					setData(newData)
				}
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
	}, [setData, bbox, active, day, agence, noCache, fetchAll])

	const agencyIdsHash =
		data && Array.isArray(data[0]) && data.map(([a]) => a).join('<|>')

	const transportsData = useMemo(() => {
		return agencyIdsHash && data.filter(filterRejectPlaneAgency)
	}, [agencyIdsHash])

	return active ? transportsData : null
}

const filterRejectPlaneAgency = ([id]) => id !== 'AEROPORT_NANTES:Operator:NTE'

const rejectNationalAgencies = (data) =>
	data.filter(
		([agencyId, agencyData]) =>
			agencyId != 1187 &&
			agencyId != 0 &&
			!agencyId.includes('FLIXBUS') &&
			agencyId != 'OCEdefault' &&
			!agencyId.startsWith('ATOUMOD') &&
			agencyId !== 'ER' &&
			agencyId !== 'ES' &&
			agencyId !== 'TAMM' && // this one has problems with coordinates
			agencyId !== 'STAN' // this one has problems with coordinates
	)
