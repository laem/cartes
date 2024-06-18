import { useEffect, useState } from 'react'

const url = '/api/edge-geolocation'
export default function () {
	const [geolocation, setGeolocation] = useState({})
	useEffect(() => {
		const doFetch = async () => {
			const request = await fetch(url)
			const json = await request.json()
			setGeolocation(json)
		}
		doFetch()
	}, [])
	return geolocation
}
