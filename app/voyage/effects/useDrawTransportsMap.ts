import { omit } from '@/components/utils/utils'
import mapboxPolyline from '@mapbox/polyline'
import { useEffect, useMemo, useState } from 'react'
import { handleColor, trainColors } from '../itinerary/motisRequest'
import { gtfsServerUrl } from '../serverUrls'
import useDrawTransport from './useDrawTransport'
import { trainTypeSncfMapping } from '../transport/SncfSelect'
import { lightenColor } from '@/components/utils/colors'
import { transitFilters } from '../transport/TransitFilter'
import { filterTransportFeatures } from '../transport/filterTransportFeatures'

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

				if (noCache) {
					setData(dataJson)
				} else setData([...data, ...dataJson])
			} catch (e) {
				if (abortController.signal.aborted) {
					console.log(
						"Requête précédente annulée, sûrement suite à un changement de bbox avant que la requête n'ait eu le temps de finir"
					)
				}
			}
		}
		doFetch()
		return () => {
			abortController.abort()
		}
	}, [setData, bbox, active, day, agence, noCache])

	const drawData = useMemo(() => {
		return {
			routesGeojson: data
				?.map(
					([
						agencyId,
						{
							geojson: { polylines, features: featuresRaw },
						},
					]) => {
						const features = polylines
							? polylines.map((polylineObject) => ({
									type: 'Feature',
									geometry: mapboxPolyline.toGeoJSON(polylineObject.polyline),
									properties: omit(['polyline'], polylineObject),
							  }))
							: featuresRaw
						/* Splines don't work : seeminlgy straight equal LineString diverge
					 * because of splines
					const features = straightFeatures.map((feature) =>
						feature.geometry.type === 'LineString'
							? bezierSpline(feature)
							: feature
					)
					*/

						const filteredFeatures = filterTransportFeatures(features, {
							routesParam,
							stop,
							trainType,
							transitFilter,
						})

						const geojson = {
							type: 'FeatureCollection',
							features: filteredFeatures.map((feature) => ({
								...feature,
								properties: { ...feature.properties, agencyId },
							})),
						}

						return addDefaultColor(geojson, agencyId)
					}
				)
				.filter(Boolean),
		}
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

// Here we make counts for a GTFS agency, to know which lines are relatively
// frequent. But I don't think it's the right approach, it should be absolute.
//
// If my agency is poor, the best line shouldn't be green even if it's the
// most frequent one. Paris' lest frequent subway shouldn't be red either, it's
// still one of the best line of the country.
//
// Also, these metrics should be computed server-side.
const addDefaultColor = (featureCollection, agencyId) => {
	const maxCountLine = Math.max(
		...featureCollection.features
			.map(
				(feature) =>
					feature.geometry.type === 'LineString' && feature.properties.perDay
			)
			.filter(Boolean)
	)
	const maxCountPoint = Math.max(
		...featureCollection.features
			.map(
				(feature) =>
					feature.geometry.type === 'Point' && feature.properties.perDay
			)
			.filter(Boolean)
	)

	console.log('indigo', featureCollection)
	const isSncf = agencyId === '1187'
	return {
		type: 'FeatureCollection',
		features: featureCollection.features.map((feature) => {
			if (feature.geometry.type === 'Point') {
				const [color, strokeColor] = stopColor(
					featureCollection.features,
					feature
				)
				return {
					...feature,
					properties: {
						...feature.properties,
						width:
							classifyStopFrequency(
								feature.properties.perDay,
								isSncf ? 15 : 30
							) / (isSncf ? 1 : 3),
						'circle-stroke-color': strokeColor,
						'circle-color': color,
					},
				}
			}
			return {
				...feature,
				properties: {
					...feature.properties,
					route_color: isSncf
						? trainColor(feature.properties)
						: handleColor(feature.properties.route_color, 'gray'),
					width: {
						0: 1.6,
						1: 2.6,
						2: 3,
						3: 0.8,
						undefined: 0.8,
					}[feature.properties.route_type],
					opacity: classifyStopFrequency(feature.properties.perDay, 2),
				},
			}
		}),
	}
}

const stopColor = (features, stop) => {
	const list = features.filter((f) =>
		f.properties.stopList?.includes(stop.properties.name)
	)

	if (list.length === 1) {
		const color = handleColor(list[0].properties.route_color, 'gray')
		console.log('yellow', color)
		return [color, color.startsWith('#') ? lightenColor(color, -15) : 'black']
	}
	return ['white', 'black']
}

const classifyStopFrequency = (perDayRaw, tuning) => {
	const perDay = perDayRaw / tuning
	const perWeek = perDay * 7
	if (perWeek < 1) return 1 / 5
	if (perDay < 3) return 2 / 5
	const perHour = perDay / 12 // could be tweaked
	if (perHour < 1) return 3 / 5
	if (perHour < 6) return 4 / 5
	return 5 / 5
}
// Lol, the SNCF GTFS is so poor
const trainColor = (properties) => {
	/* not sure the colors provided by SNCF are great compared to colors by train
	 * type
	 *
	const givenColor = handleColor(properties.route_color, null)
	console.log('GIVEN', givenColor)
	if (givenColor) return givenColor

	*/
	return trainColors[properties.sncfTrainType]?.color || 'chartreuse'
	const route = properties.route_long_name

	if (
		[
			'Paris - Briançon',
			'Paris - Rodez / Albi',
			'Paris Austerlitz - Latour de Carole',
		]
	)
		return '#28166f'

	return '#821a73'
}
