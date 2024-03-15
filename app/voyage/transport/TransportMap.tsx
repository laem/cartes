import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { o } from 'ramda'
import { useEffect, useState } from 'react'
import DateSelector from '../itinerary/DateSelector'
import { gtfsServerUrl } from '../serverUrls'
import { RouteName } from './stop/Route'

export default function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
}) {
	const [routes, setRoutes] = useState(null)

	useEffect(() => {
		if (!routesParam) return

		const doFetch = async () => {
			const request = await fetch(`${gtfsServerUrl}/routes/${routesParam}`)
			const json = await request.json()

			setRoutes(json)
		}
		doFetch()
	}, [routesParam, setRoutes])

	const setSearchParams = useSetSearchParams()

	if (routes)
		return (
			<Routes
				routes={routes}
				resetUrl={setSearchParams({ routes: undefined }, true)}
			/>
		)
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
			<Link href={backUrl}>← Retour à la liste des réseaux</Link>
			<h3>{data.agency.agency_name}</h3>
			<p>Cliquez sur une ligne pour l'explorer.</p>
		</section>
	)
}

const Routes = ({ routes, resetUrl }) => {
	console.log('pink', routes)

	return (
		<section>
			<Link href={resetUrl}>Retour aux agences</Link>
			<ol
				css={`
					margin: 1rem 0;
					list-style-type: none;
					li {
						margin: 0.6rem 0;
					}
				`}
			>
				{routes.map((route) => (
					<li key={route.route_id}>
						<RouteName route={route} />
					</li>
				))}
			</ol>
		</section>
	)
}
