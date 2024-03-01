import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'

export default function TransportMap({ day, data, selectedAgency }) {
	console.log('pink', data)
	const setSearchParams = useSetSearchParams()
	if (!data) return

	if (selectedAgency) return selectedAgency
	return (
		<section>
			<h2>Explorer les transports en commun</h2>
			<DateSelector type="day" date={day} />

			<ol>
				{data.map(([agencyId, { agency, bbox, geojson }]) => (
					<li key={agencyId}>
						<Link href={setSearchParams({ agence: agencyId }, true)}>
							{agency.agency_name}
						</Link>
					</li>
				))}
			</ol>
		</section>
	)
}
