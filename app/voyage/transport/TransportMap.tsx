import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'
import { RouteName } from './stop/Route'
import SncfSelect from './SncfSelect'
import TransitFilter from './TransitFilter'
import { sortBy } from '@/components/utils/utils'

export default function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
	trainType,
	setTrainType,
	transitFilter,
	setTransitFilter,
}) {
	/* async, not needed yet since the agency data includes routes
	useEffect(() => {
		if (!routesParam || !data) return setRoutes([])

		const doFetch = async () => {
			const request = await fetch(`${gtfsServerUrl}/routes/${routesParam}`)
			const json = await request.json()

			setRoutes(json)
		}
		doFetch()

	}, [routesParam, setRoutes, data])
    */

	const routesDemanded = routesParam?.split('|')
	const routes = sortBy((route) => -route.properties.perDay)(
		data.reduce(
			(
				memo,
				[
					,
					{
						geojson: { features },
					},
				]
			) => {
				const found = features.filter((feature) =>
					routesDemanded
						? routesDemanded.includes(feature.properties.route_id)
						: feature.geometry.type === 'LineString'
				)
				return [...memo, ...found]
			},
			[]
		)
	)

	console.log('pink routes', routes)

	const setSearchParams = useSetSearchParams()

	return (
		<section>
			<section>
				<h2>Explorer les transports en commun</h2>
				<DateSelector type="day" date={day} />
				{!selectedAgency && data?.length > 0 && (
					<ol>
						{data.map(([agencyId, { agency, bbox, geojson }]) => (
							<li key={agencyId}>
								<Link href={setSearchParams({ agence: agencyId }, true)}>
									{agency.agency_name}
								</Link>
							</li>
						))}
					</ol>
				)}
			</section>
			{routes && (
				<Routes
					routes={routes}
					resetUrl={setSearchParams({ routes: undefined }, true)}
				/>
			)}
			{data?.length > 0 && !routes && selectedAgency && (
				<Agency
					data={data.find(([id]) => id === selectedAgency)[1]}
					backUrl={setSearchParams({ agence: undefined }, true)}
				/>
			)}
			{selectedAgency == '1187' && (
				<SncfSelect {...{ data, setTrainType, trainType }} />
			)}
			<TransitFilter {...{ data, setTransitFilter, transitFilter }} />
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
			{routes.length > 0 ? (
				<Link href={resetUrl}>Effacer les routes</Link>
			) : (
				'👉️ Cliquez pour explorer les routes'
			)}

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
								<small>
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
								</small>
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
