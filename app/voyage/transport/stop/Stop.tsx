import { useEffect, useState } from 'react'
import Route from './Route'

export const isNotTransportStop = (tags) =>
	!tags || tags.public_transport !== 'platform'

const findStopIdByRef = (tags) => {
	// ref:MobiBreizh = ILLENOO2:13602
	// ref:STAR = 1320
	// ref:bzh:IOAD = MARCHE
	const ref = Object.entries(tags).find(([k, v]) => k.match(/ref(\:FR)?\:.+/g))
	if (!ref) return null
	if (ref[1].split(':').length === 2) return ref[1]
	const splits = ref[0].split(':')
	const network = splits.length === 3 ? splits[2] : splits[1]
	const stopId = ref[1].includes(network.toUpperCase())
		? ref[1]
		: network.toUpperCase() + ':' + ref[1]
	return stopId
}

async function findStopIdByGpsCoordinates(latitude: number, longitude: number) {
	const response = await fetch(
		// 'https://gtfs-server.osc-fr1.scalingo.io/stopTimes/' + stopId,
		`http://localhost:3000/getStopIds?latitude=${latitude}&longitude=${longitude}`,
		{ mode: 'cors' }
	)
	const stopIdsGps = await response.json()
	console.log("OGZ 1", stopIdsGps)
	if (stopIdsGps !== null && stopIdsGps.stopIds !== null) {
		console.log("OGZ 2")
		// TODO - Handle several stops around those coordinates
		return stopIdsGps.stopIds[0]
	} else {
		return null
	}
}

export default function Stop({ node }) {
	const tags = node.tags
	console.log('tags', tags)
	const [data, setData] = useState(null)

	let stopId = findStopIdByRef(tags)

	console.log('bus data', data)
	useEffect(() => {
		const doFetch = async () => {
			if (!stopId) {
				stopId = await findStopIdByGpsCoordinates(node.lat, node.long)
			}
			if (!stopId) return

			const response = await fetch(
				'https://gtfs-server.osc-fr1.scalingo.io/stopTimes/' + stopId,
				//	'http://localhost:3000/stopTimes/' + stopId,
				{ mode: 'cors' }
			)
			const json = await response.json()

			setData(json)
		}
		doFetch()
	}, [stopId, setData])
	if (!data || !data.routes) return null

	return (
		<div>
			<ul
				css={`
					list-style-type: none;
				`}
			>
				{data.routes.map((route) => (
					<Route
						key={route.route_id}
						route={route}
						stops={data.stops
							.map((stop) => {
								const trip = data.trips.find((t) => t.trip_id === stop.trip_id)
								return { ...stop, trip }
							})
							.filter((stop) => stop.trip.route_id === route.route_id)}
					/>
				))}
			</ul>
		</div>
	)
}

export const transportKeys = ['ref:FR:STAR']
