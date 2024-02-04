import { useEffect } from 'react'
import { computeMotisTrips } from './motisTripsRequest'

export default function useMotisTrip(
	transit,
	selectedConnection,
	setMotisTrips
) {
	const trips =
		transit?.connections && transit.connections[selectedConnection].trips

	useEffect(() => {
		async function doFetch() {
			if (!trips) return
			const json = await computeMotisTrips(trips)

			if (json.state === 'error') return json

			if (!json?.content) return null
			console.log('trips success', json)

			return json.content
		}
		doFetch()
	}, [trips])
}
