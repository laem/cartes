import { useEffect, useState } from 'react'

const url = '/api/edge-geolocation'
export default function (defaultState) {
	const [geolocation, setGeolocation] = useState(defaultState)
	useEffect(() => {
		const doFetch = async () => {
			const request = await fetch(url)
			const json = await request.json()
			if (json && json.latitude && json.longitude) setGeolocation(json)
		}
		doFetch()
	}, [])
	return geolocation
}
