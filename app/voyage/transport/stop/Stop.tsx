import { useEffect, useState } from 'react'
import Route from './Route'

export const isNotTransportStop = (tags) =>
	!tags || tags.public_transport !== 'platform'

const findStopId = (tags) => {
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

export default function Stop({ node }) {
	const tags = node.tags
	console.log('tags', tags)
	const [data, setData] = useState(null)
	const [stopIdGps, setStopIdGps] = useState(null)

	let stopId = findStopId(tags)
	let testId = ""
	if (stopId === null) {
		// TODO - Fix this hacky way to trigger the UseEffect()
		testId += " "
		console.log("Null StopID, search for stop around click", node.lat, node.long)
	}
	useEffect(() => {
		const doFetch = async () => {
			console.log("passe 1")
			const response = await fetch(
				// 'https://gtfs-server.osc-fr1.scalingo.io/stopTimes/' + stopId,
				`http://localhost:3000/getStopIds?latitude=${node.lat}&longitude=${node.long}`,
				{ mode: 'cors' }
			)
			const json = await response.json()
			setStopIdGps(json)
		}
		doFetch()
	}, [testId])
	if (stopIdGps !== null && stopIdGps.stopIds !== null) {
		// TODO - Handle several stops around those coordinates
		stopId = stopIdGps.stopIds[0]
	}

	console.log('bus data', data)
	useEffect(() => {
		const doFetch = async () => {
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
