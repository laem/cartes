import { useEffect, useState } from 'react'

export default function useGeo() {
	const [geo, setGeo] = useState(null)
	useEffect(() => {
		fetch('/api/geolocation')
			.then((res) => res.json())
			.then((json) => setGeo(json))
	}, [])

	return geo
}
