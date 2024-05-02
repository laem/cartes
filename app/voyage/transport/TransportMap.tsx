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
		if (!routesParam || !data) return

		/* async, not needed yet since the agency data includes routes
		const doFetch = async () => {
			const request = await fetch(`${gtfsServerUrl}/routes/${routesParam}`)
			const json = await request.json()

			setRoutes(json)
		}
		doFetch()
    */

		const routesDemanded = routesParam.split('|')
		const nextRoutes = data.reduce((memo, [, { features }]) => {
			const found = features.filter((feature) =>
				routesDemanded.includes(feature.properties.route_id)
			)
			return [...memo, ...found]
		}, [])
		setRoutes(nextRoutes)
	}, [routesParam, setRoutes, data])

	const setSearchParams = useSetSearchParams()

	if (routes)
		return (
			<Routes
				routes={routes}
				resetUrl={setSearchParams({ routes: undefined }, true)}
			/>
		)

	if (!data || !data.length) return

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
					> li {
						margin: 0.6rem 0;
					}
				`}
			>
				{routes.map((route) => {
					const stopList = route.properties.stopList
					return (
						<li key={route.properties.route_id}>
							<RouteName route={route.properties} />
							{stopList.length ? (
								<details>
									<summary>Arrêts</summary>
									<ol
										css={`
											margin-left: 2rem;
										`}
									>
										{stopList.map((stop) => (
											<li key={stop}>{stop}</li>
										))}
									</ol>
								</details>
							) : (
								'Direct'
							)}
						</li>
					)
				})}
			</ol>
		</section>
	)
}
