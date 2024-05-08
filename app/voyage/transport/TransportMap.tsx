import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'
import { RouteName } from './stop/Route'
import SncfSelect from './SncfSelect'
import TransitFilter, { transitFilters } from './TransitFilter'
import { sortBy } from '@/components/utils/utils'
import StopByName from './StopByName'
import { ModalCloseButton } from '../UI'

export default function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
	trainType,
	setTrainType,
	transitFilter,
	setTransitFilter,
	stop,
	resetStop,
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

	const transitFilterFunction = transitFilters.find(
		([key]) => key === transitFilter
	)[1].filter
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
				const filteredFeatures = features.filter(transitFilterFunction)
				const found = filteredFeatures.filter((feature) =>
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
			{stop && (
				<section
					css={`
						position: relative;
						padding-top: 0.6rem;
					`}
				>
					<ModalCloseButton
						title="Fermer l'encart arrêt de transport"
						onClick={() => {
							setSearchParams({ arret: undefined })
						}}
					/>
					<h2>{stop}</h2>
					{data?.length > 0 && <StopByName stopName={stop} data={data} />}
				</section>
			)}
			{data?.length > 0 && !routes && selectedAgency && (
				<Agency
					data={data.find(([id]) => id === selectedAgency)[1]}
					backUrl={setSearchParams({ agence: undefined }, true)}
				/>
			)}
			{!stop && selectedAgency == '1187' ? (
				<SncfSelect {...{ data, setTrainType, trainType }} />
			) : (
				<TransitFilter {...{ data, setTransitFilter, transitFilter }} />
			)}
			{!stop && routes && (
				<Routes
					routesParam={routesParam}
					routes={routes}
					resetUrl={setSearchParams({ routes: undefined }, true)}
				/>
			)}
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

const Routes = ({ routes, resetUrl, routesParam }) => {
	console.log('pink', routes)

	return (
		<section>
			{routesParam ? (
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
							<div>
								Voyages par jour : {Math.round(route.properties.perDay / 2)}.
								Par heure : {Math.round(route.properties.perDay / 10 / 2)}
							</div>
							{route.properties.isNight && <div>🌜️ Bus de nuit</div>}
							{route.properties.isSchool && <div>🎒 Bus scolaire</div>}
							{stopList.length ? (
								<small>
									<details open={routes.length === 1}>
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
