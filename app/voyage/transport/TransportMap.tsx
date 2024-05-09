import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'
import { RouteName } from './stop/Route'
import SncfSelect from './SncfSelect'
import TransitFilter, { transitFilters } from './TransitFilter'
import { sortBy } from '@/components/utils/utils'
import StopByName from './StopByName'
import { ModalCloseButton } from '../UI'
import { memo } from 'react'

export default memo(function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
	trainType,
	transitFilter,
	stop,
}) {
	console.log('TransportMap')
	const setSearchParams = useSetSearchParams()

	const setTransitFilter = (filter) => setSearchParams({ filtre: filter })

	const setTrainType = (trainType) =>
		setSearchParams({ 'type de train': trainType })

	const resetStop = () => setSearchParams({ arret: undefined })
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
		data.reduce((memo, [, { features }]) => {
			const filteredFeatures = features.filter(transitFilterFunction)
			const found = filteredFeatures.filter((feature) =>
				routesDemanded
					? routesDemanded.includes(feature.properties.route_id)
					: feature.geometry.type === 'LineString'
			)
			return [...memo, ...found]
		}, [])
	)

	console.log('pink routes', routes)

	return (
		<section>
			<section>
				<h2>Explorer les transports en commun</h2>
				{false && <DateSelector type="day" date={day} />}
				{!selectedAgency && data?.length > 0 && (
					<ol>
						{data.map(([agencyId, { agency, bbox, features }]) => (
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
			{!stop &&
				(selectedAgency == '1187' ? (
					<SncfSelect {...{ data, setTrainType, trainType }} />
				) : (
					<TransitFilter {...{ data, setTransitFilter, transitFilter }} />
				))}
			{!stop && routes && (
				<Routes
					routesParam={routesParam}
					routes={routes}
					setRoutes={(routes) => setSearchParams({ routes }, true)}
					setStopName={(stopName) => setSearchParams({ arret: stopName }, true)}
				/>
			)}
		</section>
	)
})

const Agency = ({ data, backUrl }) => {
	return (
		<section>
			<Link href={backUrl}>← Retour à la liste des réseaux</Link>
			<h3>{data.agency.agency_name}</h3>
			<p>Cliquez sur une ligne pour l'explorer.</p>
		</section>
	)
}

const Routes = ({ routes, setRoutes, setStopName, routesParam }) => {
	console.log('pink', routes)

	return (
		<section
			css={`
				position: relative;
				margin-top: 0.6rem;
				padding-top: 0.4rem;
			`}
		>
			{routesParam ? (
				<ModalCloseButton
					title="Réinitialiser la sélection de lignes"
					onClick={() => {
						setRoutes(undefined)
					}}
				/>
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
						<li
							key={route.properties.route_id}
							css={`
								a {
									text-decoration: none;
									color: inherit;
								}
							`}
						>
							<Link href={setRoutes(route.properties.route_id)}>
								<RouteName route={route.properties} />
							</Link>
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
											{stopList.map((stop, index) => (
												<li key={index}>
													<Link href={setStopName(stop)}>{stop}</Link>
												</li>
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
