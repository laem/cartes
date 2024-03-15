import { useEffect, useMemo, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
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
		if (!active || !bbox) return

		const doFetch = async () => {
			const [[longitude2, latitude], [longitude, latitude2]] = bbox

			const url = (format) =>
				`${gtfsServerUrl}/agencyArea/${latitude}/${longitude}/${latitude2}/${longitude2}/${format}/?${
					day ? `day=${formattedDay}` : ''
				}`
			const format = !data ? 'geojson' : 'prefetch'
			const formattedDay = day?.replace(/-/g, '')
			const request = await fetch(url(format), { mode: 'cors' })
			const json = await request.json()

			if (format === 'geojson') return setData(json)

			const agencies = data.map(([id]) => id),
				newAgencies = json.filter((agency) => !agencies.includes(agency))

			console.log('pink prefect new agencies', agencies, json, newAgencies)
			if (!newAgencies.length) return

			const dataRequest = await fetch(
				url('geojson') + `&selection=${newAgencies.join('|')}`,
				{ mode: 'cors' }
			)

			const dataJson = await dataRequest.json()
			console.log('pink dataJSON', dataJson)

			setData([...data, ...dataJson])
		}
		doFetch()
	}, [setData, bbox, active, day])

	const drawData = useMemo(() => {
		return {
			routesGeojson: data?.map(([agencyId, { geojson }]) =>
				agencyId == '1187' ? addDefaultColor(geojson) : geojson
			),
		}
	}, [data])

	useDrawTransport(
		map,
		drawData,
		safeStyleKey,
		'transitMap' + (data || []).map(([id]) => id) + day, // TODO When the selection of agencies will change, the map will redraw, which is a problem : only new agencies should be added
		day
	)
	console.log('forestgreen map', data)
	return data
}

const addDefaultColor = (featureCollection) => {
	const maxCountLine = Math.max(
		...featureCollection.features
			.map(
				(feature) =>
					feature.geometry.type === 'LineString' && feature.properties.count
			)
			.filter(Boolean)
	)
	const maxCountPoint = Math.max(
		...featureCollection.features
			.map(
				(feature) =>
					feature.geometry.type === 'Point' && feature.properties.count
			)
			.filter(Boolean)
	)
	console.log('cyan', featureCollection)
	return {
		type: 'FeatureCollection',
		features: featureCollection.features.map((feature) =>
			feature.geometry.type === 'Point'
				? {
						...feature,
						properties: {
							width: Math.max(feature.properties.count / maxCountPoint, 0.1),
							'circle-stroke-color': '#0a2e52',
							'circle-color': '#185abd',
						},
				  }
				: {
						...feature,
						properties: {
							...feature.properties,
							route_color: '#821a73',
							route_type: 2,
							opacity: Math.max(feature.properties.count / maxCountLine, 0.1),
						},
				  }
		),
	}
}

const circleRadiusGenerator = (
	what: 'radius' | 'stroke' = 'radius',
	multiplier = 1
) => [
	'interpolate',
	['linear', 1],
	['zoom'],
	0,
	0.1 * multiplier,
	12,
	1 * multiplier,
	18,
	(what === 'radius' ? 10 : 4) * multiplier,
]
