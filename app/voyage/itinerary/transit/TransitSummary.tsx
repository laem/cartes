import BestConnection from './BestConnection'
import {
	NoMoreTransitToday,
	NoTransit,
	TransitScopeLimit,
} from './NoTransitMessages'
import TransitLoader from './TransitLoader'
import findBestConnection from './findBestConnection'
import { connectionStart, filterNextConnections } from './utils'

export default function TransitSummary({ itinerary }) {
	const data = itinerary.routes.transit
	console.log('summary', data)
	if (data.state === 'loading') return <TransitLoader />
	if (data.state === 'error') return <NoTransit />
	if (!data?.connections || !data.connections.length)
		return <TransitScopeLimit />

	const nextConnections = filterNextConnections(
		data.connections,
		itinerary.date
	)
	if (nextConnections.length < 1)
		return <NoMoreTransitToday date={itinerary.date} />

	const firstDate = connectionStart(nextConnections[0]) // We assume Motis orders them by start date, when you start to walk. Could also be intersting to query the first end date

	const bestConnection = findBestConnection(nextConnections)
	if (bestConnection) return <BestConnection bestConnection={bestConnection} />
}
