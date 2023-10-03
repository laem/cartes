import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Map from 'Components/Map'
import { decode } from '@/components/valhalla-decode-shape'

const params = ([lat, lon], [lat2, lon2]) => ({
	locations: [
		{ lon, lat, type: 'break' },
		{ lon2, lat2, type: 'break' },
	],
	directions_options: { units: 'kilometers' },
	id: 'valhalla_directions',
})

const getData = () => {
	const url = `https://valhalla1.openstreetmap.de/route?json=${JSON.stringify(
		params
	)}`
	console.log('URL', url)
	return fetch(url)
}
export default async function MyPage() {
	const data = await getData()
	const json = await data.json()
	const shape = json.trip.legs[0].shape
	const decoded = decode(shape)
	const geoJSON = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {},
				geometry: {
					coordinates: decoded,
					type: 'LineString',
				},
			},
		],
	}
	console.log(shape, decoded)

	return (
		<div>
			<Map geoJSON={geoJSON} />
		</div>
	)
}
