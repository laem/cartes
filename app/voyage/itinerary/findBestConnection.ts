import { dateFromMotis, humanDuration } from './Transit'

const connectionDuration = (connection) =>
	connection.stops.slice(-1)[0].arrival.time -
	connection.stops[0].departure.time

export default function findBestConnection(connections) {
	console.log('prune motis', connections)

	/*
	 * Very simple algorithm to find a best candidate
	 * to be highlighted at the top
	 * */
	const selected = connections
		.filter((connection) => connection.trips.length === 1)
		//TODO this selection should probably made using distance, not time. Or both.
		//it's ok to walk 20 min, and take the train for 10 min, if the train goes at
		//200 km/h
		.filter((connection) => {
			const walking = connection.transports.filter(
					(transport) => transport.move_type === 'Walk'
				),
				walkingTime = walking.reduce((memo, next) => memo + next.seconds, 0)

			return (
				walkingTime <
				// because why not ? See note above
				(2 / 3) *
					connection.transports.find(
						(transport) => transport.move_type === 'Transport'
					).seconds
			)
		})
	if (!selected.length) return null

	const best = selected.reduce((memo, next) => {
		if (memo === null) return next
		if (connectionDuration(next) < connectionDuration(memo)) return next
		return memo
	}, null)

	return { best, interval: getBestIntervals(connections, best) }
}

export const bestSignature = (connection) => connection.trips[0].id.line_id

export const getBestIntervals = (connections, best) => {
	const bests = connections.filter(
		(connection) =>
			connection.trips.length === 1 &&
			bestSignature(connection) === bestSignature(best)
	)
	const departures = bests.map(
		(connection) => connection.stops[0].departure.time
	)

	if (departures.length === 1) return 'une fois par jour'

	const dates = departures.map((departure) => dateFromMotis(departure))

	const intervals = departures
		.map((date, i) => i > 0 && date - departures[i - 1])
		.filter(Boolean)
	const max = Math.max(...intervals)

	console.log('orange max', max, intervals)
	const description = `au moins ${humanDuration(max).interval}`
	return description
}
