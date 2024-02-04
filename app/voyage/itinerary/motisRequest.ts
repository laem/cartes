const datePlusHours = (date, hours) => {
	const today = new Date(date)
	const newToday = today.setHours(today.getHours() + hours)
	return Math.round(newToday / 1000)
}

export const nowStamp = () => {
	return Math.round(Date.now() / 1000)
}

export const buildRequestBody = (start, destination, date) => {
	const begin = Math.round(new Date(date).getTime() / 1000),
		end = datePlusHours(date, 2) // TODO This parameter should probably be modulated depending on the transit offer in the simulation setup. Or, query for the whole day at once, and filter them in the UI

	console.log('dato', nowStamp(), 'begin date then timestamp', date, begin, end)
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
			start_modes: [
				{
					mode_type: 'FootPPR',
					mode: {
						search_options: { profile: 'default', duration_limit: 1800 },
					},
				},
			],
			destination_type: 'InputPosition',
			destination,
			destination_modes: [
				{
					mode_type: 'FootPPR',
					mode: { search_options: { profile: 'default', duration_limit: 900 } },
				},
			],
			search_type: 'Accessibility',
			search_dir: 'Forward',
			router: '',
		},
	}
	return body
}

export const computeMotisTrip = async (start, destination, date) => {
	const body = buildRequestBody(start, destination, date)

	try {
		const request = await fetch(`https://motis.cartes.app`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
		if (!request.ok) {
			console.error('Error fetching motis server')
			return { state: 'error' }
		}
		const json = await request.json()
		console.log('motis', json)

		const augmentedConnections = await Promise.all(
			json.content.connections.map(async (connection) => {
				const { trips, stops, transports } = connection
				const augmentedTransports = await Promise.all(
					transports.map(async (transport) => {
						const trip = trips.find(
							(trip) => trip.id.line_id === transport.move.line_id
						)

						const tripId = trip?.id.id.split('_')[1] // `bretagne_` prefix added by Motis it seems, coming from its config.ini file that names schedules with ids
						const doFetch = async () => {
							try {
								const request = await fetch(
									`https://gtfs-server.osc-fr1.scalingo.io/routes/trip/${tripId}`
								)
								const json = await request.json()
								const safeAttributes = json.routes[0] || {}
								return safeAttributes
							} catch (e) {
								console.error('Unable to fetch route color from GTFS server')
								return {}
							}
						}
						const attributes = await doFetch()

						return { ...transport, ...attributes, trip, tripId }
					})
				)
				return { ...connection, transports: augmentedTransports }
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
