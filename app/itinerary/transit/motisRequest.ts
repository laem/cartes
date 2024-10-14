import { lightenColor } from '@/components/utils/colors'
import transportIcon from './transportIcon'
import { distance, point } from '@turf/turf'
import { gtfsServerUrl, motisServerUrl } from '@/app/serverUrls'

const datePlusHours = (date, hours) => {
	const today = new Date(date)
	const newToday = today.setHours(today.getHours() + hours)
	return Math.round(newToday / 1000)
}

export const nowStamp = () => Math.round(Date.now() / 1000)

export const stamp = (date) => Math.round(new Date(date).getTime() / 1000)

export const defaultRouteColor = '#d3b2ee'

export const buildRequestBody = (start, destination, date) => {
	const begin = Math.round(new Date(date).getTime() / 1000),
		end = datePlusHours(date, 2) // TODO This parameter should probably be modulated depending on the transit offer in the simulation setup. Or, query for the whole day at once, and filter them in the UI

	const requestDistance = distance(
		point([start.lng, start.lat]),
		point([destination.lng, destination.lat])
	)

	console.log('itinerary distance', requestDistance)

	// See https://github.com/laem/cartes/issues/416
	// 1h of bike ~= 20km
	// So with 2h and 40 km, we should cover most of the hexagone
	const bikeTrainSearchDistance = //0 * 60
		(requestDistance < 50 ? 0 : requestDistance < 200 ? 1 : 2) * 60 * 60

	console.log({
		requestDistance,
		bikeTrainSearchDistance: bikeTrainSearchDistance / 60 + ' min',
	})

	const symetricModes = [
		{
			mode_type: 'FootPPR',
			mode: {
				search_options: { profile: 'distance_only', duration_limit: 15 * 60 },
			},
		},
		bikeTrainSearchDistance > 0 && {
			mode_type: 'Bike',
			mode: {
				max_duration: bikeTrainSearchDistance,
			},
		},
	].filter(Boolean)

	const body = {
		destination: { type: 'Module', target: '/intermodal' },
		content_type: 'IntermodalRoutingRequest',
		content: {
			start_type: 'IntermodalPretripStart',
			start: {
				position: start,
				interval: {
					begin,
					end,
				},
				min_connection_count: 5,
				extend_interval_earlier: true,
				extend_interval_later: true,
			},
			start_modes: symetricModes,
			destination_type: 'InputPosition',
			destination,
			destination_modes: symetricModes,
			search_type: 'Default',
			search_dir: 'Forward',
			router: '',
		},
	}
	return body
}

const errorCorrespondance = {
	'access: timestamp not in schedule':
		'Notre serveur a eu un problème de mise à jour des données de transport en commun :-/',
}
export const computeMotisTrip = async (start, destination, date) => {
	const body = buildRequestBody(start, destination, date)

	try {
		const request = await fetch(motisServerUrl, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
		if (!request.ok) {
			console.error('Error fetching motis server')
			const json = await request.json()
			console.log('cyan', json)

			const motisReason = json.content?.reason
			const reason = errorCorrespondance[motisReason]

			return { state: 'error', reason }
		}
		const json = await request.json()
		console.log('motis', json)
		console.log('motis statistics', JSON.stringify(json.content.statistics))

		const augmentedConnections = await Promise.all(
			json.content.connections.map(async (connection) => {
				const { trips, stops, transports } = connection
				const augmentedTransports = await Promise.all(
					transports.map(async (transport) => {
						const trip = trips.find(
							(trip) => trip.id.line_id === transport.move.line_id
						)

						console.log('red debug', trip?.id)
						const tripId = trip?.id.id.replace(
							/(.+)\|(.+)\_(.+)/,
							(correspondance, p1, p2, p3, decalage, chaine) => p1 + p3
						)
						const doFetch = async () => {
							try {
								if (!tripId) return {}
								const request = await fetch(
									`${gtfsServerUrl}/routes/trip/${encodeURIComponent(tripId)}`
								)
								const json = await request.json()
								const safeAttributes = json.routes[0] || {}
								return safeAttributes
							} catch (e) {
								console.error('Unable to fetch route color from GTFS server')
								return {}
							}
						}
						const gtfsAttributes = await doFetch()
						const { route_color, route_text_color } = gtfsAttributes

						const isBretagneTGV = trip?.id.id.startsWith('bretagne_SNCF2')

						const isOUIGO =
							trip?.id.station_id.includes('OUIGO') ||
							trip?.id.target_station_id.includes('OUIGO') // well, on fait avec ce qu'on a
						const isTGVStop =
							trip?.id.station_id.includes('TGV INOUI') ||
							trip?.id.target_station_id.includes('TGV INOUI') // well, on fait avec ce qu'on a
						const isTGV = isTGVStop || isBretagneTGV
						//TODO this should be a configuration file that sets not only main
						//colors, but gradients, icons (ouigo, inoui, tgv, ter, etc.)
						const sourceGtfs = trip?.id.id.split('_')[0],
							prefix = sourceGtfs && sourceGtfs.split('|')[0],
							frenchTrainType = isOUIGO
								? 'OUIGO'
								: isTGV
								? 'TGV'
								: prefix
								? prefix === 'ter'
									? 'TER'
									: prefix === 'tgv'
									? 'TGV'
									: null
								: null

						const customAttributes = {
							route_color: isTGV
								? trainColors.TGV['color']
								: isOUIGO
								? trainColors.OUIGO['color']
								: frenchTrainType === 'TER'
								? trainColors.TER['color']
								: handleColor(route_color, defaultRouteColor),
							route_text_color: isTGV
								? '#fff'
								: isOUIGO
								? '#fff'
								: handleColor(route_text_color, '#000000'),
							icon: transportIcon(frenchTrainType, prefix),
						}
						const attributes = {
							...gtfsAttributes,
							...customAttributes,
						}

						/* Temporal aspect */
						const fromStop = stops[transport.move.range.from]
						const toStop = stops[transport.move.range.to]

						const seconds = toStop.arrival.time - fromStop.departure.time
						const name = transport.move.name
						const shortName =
							frenchTrainType ||
							(name?.startsWith('Bus ') ? name.replace('Bus ', '') : name)
						return {
							...transport,
							...attributes,

							route_color_darker: attributes.route_color
								? lightenColor(attributes.route_color, -20)
								: '#5b099f',
							trip,
							tripId,
							frenchTrainType,
							seconds,
							shortName,
						}
					})
				)
				const seconds = augmentedTransports.reduce(
					(memo, next) => memo + next.seconds,
					0
				)

				return { ...connection, transports: augmentedTransports, seconds }
			})
		)
		const augmentedResponse = {
			...json,
			content: {
				...json.content,
				connections: augmentedConnections,
			},
		}
		return augmentedResponse
	} catch (e) {
		// Can happen when no transit found, the server returns a timeout
		// e.g. for Rennes -> Port Navalo on a sunday...
		// Erratum : there was a problem on the server. Anyway, this error state is
		// useful
		console.error('Error fetching motis server', e)
		return { state: 'error' }
	}
}

export const trainColors = {
	TGV: { color: '#b8175e' },
	OUIGO: { color: '#e60075', border: '#0096ca' },
	'Train TER': { color: '#004da4' },
	TER: { color: '#004da4' },
	'TGV INOUI': { color: '#9b2743' },
	'INTERCITES de nuit': { color: '#28166f' },
	INTERCITES: { color: 'Teal' },
	'Car TER': { color: '#004da4', pointillés: true },
	Car: { color: '#004da4', pointillés: true },
	Lyria: { color: '#eb0a28' },
	ICE: { color: '#f01414' },
	TramTrain: { color: '#004da4' },
	Navette: { color: '#004da4', pointillés: true },
}
export function handleColor(rawColor, defaultColor) {
	if (!rawColor) return defaultColor
	if (rawColor.startsWith('#')) return rawColor
	if (rawColor.match(/^([0-9A-Fa-f])+$/) && rawColor.length === 6)
		return '#' + rawColor
	console.log('Unrecognized route color', rawColor)
	return defaultColor
}
