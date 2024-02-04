const datePlusHours = (date, hours) => {
	const today = new Date(date)
	const newToday = today.setHours(today.getHours() + hours)
	return Math.round(newToday / 1000)
}

const nowStamp = () => {
	return Math.round(Date.now() / 1000)
}

export const buildRequestBody = (start, destination, date) => {
	const begin = Math.round(new Date(date).getTime() / 1000),
		end = datePlusHours(date, 2) // TODO This parameter should probably be modulated depending on the transit offer in the simulation setup. Or, query for the whole day at once, and filter them in the UI

	console.log('dato', nowStamp(), begin, end)
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
		return json
	} catch (e) {
		// Can happen when no transit found, the server returns a timeout
		// e.g. for Rennes -> Port Navalo on a sunday...
		// Erratum : there was a problem on the server. Anyway, this error state is
		// useful
		console.error('Error fetching motis server', e)
		return { state: 'error' }
	}
}
