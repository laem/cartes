import { useEffect, useState } from 'react'
import Route from './Route'

export const isNotTransportStop = (tags) =>
	!tags || tags.public_transport !== 'platform'

export const findStopId = (tags) => {
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
export default function Stop({ tags, data }) {
	console.log('olive bus data', data, 'tags', tags)
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
						stops={data.stops.filter(
							(stop) => stop.trip.route_id === route.route_id
						)}
					/>
				))}
			</ul>
		</div>
	)
}

export const transportKeys = ['ref:FR:STAR']
