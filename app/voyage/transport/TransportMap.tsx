import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'

export default function TransportMap({ day, data, selectedAgency }) {
	console.log('pink', data)
	const setSearchParams = useSetSearchParams()
	if (!data) return

	if (selectedAgency)
		return (
			<Agency
				data={data.find(([id]) => id === selectedAgency)[1]}
				backUrl={setSearchParams({ agence: undefined }, true)}
			/>
		)
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

const Agency = ({ data, backUrl }) => {
	console.log('pink agency', data)
	return (
		<section>
			<Link href={backUrl}>← Retour à la liste</Link>
			<h3>{data.agency.agency_name}</h3>
			<p>Cliquez sur une ligne pour l'explorer.</p>
		</section>
	)
}
