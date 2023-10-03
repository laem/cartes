import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Map from 'Components/Map'
import { decode } from '@/components/valhalla-decode-shape'

const params = {
	costing: 'auto',
	costing_options: {
		auto: {
			exclude_polygons: [],
			maneuver_penalty: 5,
			country_crossing_penalty: 0,
			country_crossing_cost: 600,
			width: 1.6,
			height: 1.9,
			use_highways: 1,
			use_tolls: 1,
			use_ferry: 1,
			ferry_cost: 300,
			use_living_streets: 0.5,
			use_tracks: 0,
			private_access_penalty: 450,
			ignore_closures: false,
			closure_factor: 9,
			service_penalty: 15,
			service_factor: 1,
			exclude_unpaved: 1,
			shortest: false,
			exclude_cash_only_tolls: false,
			top_speed: 140,
			fixed_speed: 0,
			toll_booth_penalty: 0,
			toll_booth_cost: 15,
			gate_penalty: 300,
			gate_cost: 30,
			include_hov2: false,
			include_hov3: false,
			include_hot: false,
			disable_hierarchy_pruning: false,
		},
	},
	exclude_polygons: [],
	locations: [
		{ lon: -4.4860088, lat: 48.3905283, type: 'break' },
		{ lon: -1.6800198, lat: 48.1113387, type: 'break' },
	],
	directions_options: { units: 'kilometers' },
	id: 'valhalla_directions',
}

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
