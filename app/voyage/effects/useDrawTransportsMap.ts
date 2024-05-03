import { omit } from '@/components/utils/utils'
import mapboxPolyline from '@mapbox/polyline'
import { useEffect, useMemo, useState } from 'react'
import { handleColor, trainColors } from '../itinerary/motisRequest'
import { gtfsServerUrl } from '../serverUrls'
import useDrawTransport from './useDrawTransport'

export default function useDrawTransportsMap(
	map,
	active,
	safeStyleKey,
	setTempStyle,
	day,
	bbox,
	agence,
	routesParam,
	stop
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
					url('geojson') + (agence || newAgencies.join('|')),
					{
						mode: 'cors',
						signal: abortController.signal,
					}
				)

				const dataJson = await dataRequest.json()

				setData([...data, ...dataJson])
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
	}, [setData, bbox, active, day, agence])

	const drawData = useMemo(() => {
		return {
			routesGeojson: data
				?.map(([agencyId, { polylines, features: featuresRaw }]) => {
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
					const geojson = {
						type: 'FeatureCollection',
						features:
							routesParam || stop
								? features.filter(
										(route) =>
											(!routesParam ||
												routesParam
													.split('|')
													.includes(route.properties.route_id)) &&
											(!stop || route.properties.stopList?.includes(stop))
								  )
								: features,
					}

					return addDefaultColor(geojson, agencyId)
				})
				.filter(Boolean),
		}
	}, [data, routesParam, stop])

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

	console.log('indigo', featureCollection)
	return {
		type: 'FeatureCollection',
		features: featureCollection.features.map((feature) =>
			feature.geometry.type === 'Point'
				? {
						...feature,
						properties: {
							...feature.properties,
							width: Math.max(
								Math.sqrt(feature.properties.count / maxCountPoint),
								0.2
							),
							'circle-stroke-color': '#0a2e52',
							'circle-color': '#185abd',
						},
				  }
				: {
						...feature,
						properties: {
							...feature.properties,
							route_color:
								agencyId === '1187'
									? trainColor(feature.properties)
									: handleColor(feature.properties.route_color, 'gray'),
							route_type: 2,
							opacity: Math.max(feature.properties.count / maxCountLine, 0.1), //also tried sqrt here, but the opacity mix is really interesting even on high values
						},
				  }
		),
	}
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
