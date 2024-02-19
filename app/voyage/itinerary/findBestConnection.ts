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
	const best = connections
		.filter((connection) => connection.trips.length === 1)
		.reduce((memo, next) => {
			if (memo === null) return next
			if (connectionDuration(next) < connectionDuration(memo)) return next
			return memo
		}, null)

	return { best, interval: getBestIntervals(connections, best) }
}

export const bestSignature = (connection) => connection.trips[0].id.line_id

export const getBestIntervals = (connections, best) => {
	const bests = connections.filter(
		(connection) => bestSignature(connection) === bestSignature(best)
	)
	const departures = bests.map(
		(connection) => connection.stops[0].departure.time
	)

	const dates = departures.map((departure) => dateFromMotis(departure))

	const intervals = departures
		.map((date, i) => i > 0 && date - departures[i - 1])
		.filter(Boolean)
	const max = Math.max(...intervals)
	const description = `au moins ${humanDuration(max).interval}`
	return description
}
