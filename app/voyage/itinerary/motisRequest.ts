const todayPlusHours = (hours) => {
	const today = new Date()
	const newToday = today.setHours(today.getHours() + hours)
	return Math.round(newToday / 1000)
}

const nowStamp = () => {
	return Math.round(Date.now() / 1000)
}

export const buildRequestBody = (start, destination) => {
	const body = {
		destination: { type: 'Module', target: '/intermodal' },
		content_type: 'IntermodalRoutingRequest',
		content: {
			start_type: 'IntermodalPretripStart',
			start: {
				position: start,
				interval: { begin: nowStamp(), end: todayPlusHours(6) },
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

export const computeMotisTrip = async (start, destionation) => {
	const body = buildRequestBody(start, destionation)

	const request = await fetch(`http://localhost:3000/`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	const json = await request.json()
	console.log('motis', json)
	return json
}
