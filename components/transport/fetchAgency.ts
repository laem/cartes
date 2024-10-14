import { gtfsServerUrl } from '@/app/serverUrls'
import {
	getLinesSortedByFrequency,
	getTransitFilter,
} from '@/app/transport/TransitFilter'
import { decodeTransportsData } from '@/app/transport/decodeTransportsData'

export default async function fetchAgency(searchParams) {
	if (searchParams.style === 'transports' && searchParams.agence != null) {
		const url = `${gtfsServerUrl}/agencyArea/${searchParams.agence}`
		console.log('Will fetch this URL for metadata', url)

		const request = await fetch(url)
		const json = await request.json()
		const data = decodeTransportsData([searchParams.agence, json])

		return data // [agency_name, features]
	}
}

export const buildAgencyMeta = async (searchParams) => {
	const data = await fetchAgency(searchParams)
	if (!data) return

	const [
		,
		{
			agency: { agency_name },
			features,
		},
	] = data

	const lines = features.filter(
		(feature) =>
			feature && feature.geometry?.type === 'LineString' && feature.properties
	)
	const heavyFilter = getTransitFilter((key) =>
			['tram', 'métro'].includes(key)
		).filter,
		hasHeavy = lines.filter((feature) => heavyFilter(feature)).length > 0

	const transportType = hasHeavy ? `transport (bus, tram, métro)` : 'bus'
	const mainLines = getLinesSortedByFrequency(lines).slice(0, 10),
		mainLinesNames = mainLines.map(
			({ properties }) => properties.route_short_name
		)
	return {
		title: `Plan du réseau de ${transportType} ${agency_name}`,
		description: `Plan complet des lignes de transport en commun du réseau de ${transportType} ${agency_name} : lignes ${mainLinesNames.join(
			', '
		)}`,
	}
}
