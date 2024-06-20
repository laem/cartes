import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'
import SncfSelect from './SncfSelect'
import TransitFilter, { transitFilters } from './TransitFilter'
import { sortBy, unique } from '@/components/utils/utils'
import StopByName from './StopByName'
import { ModalCloseButton } from '../UI'
import Routes from './TransportMapRoutes'

export default function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
	trainType,
	transitFilter,
	stop,
	bbox,
}) {
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
	const rand = Math.random()
	console.time('routes' + rand)
	console.log('transportmap bbox', bbox)

	const routes = sortBy((route) => -route.properties.perDay)(
		data.reduce((memo, [agencyId, { features }]) => {
			if (selectedAgency != null && agencyId !== selectedAgency) return memo
			const filteredFeatures = features.filter(transitFilterFunction)
			const found = filteredFeatures.filter((feature, i) => {
				if (routesDemanded)
					return routesDemanded.includes(feature.properties.route_id)
				else {
					if (feature.geometry.type !== 'LineString') return

					if (i === 0) console.log('transportmap feature', feature)

					const hasCoordinateInBbox = feature.geometry.coordinates.some(
						([lon, lat]) =>
							lon > bbox[0][0] &&
							lon < bbox[1][0] &&
							lat > bbox[0][1] &&
							lat < bbox[1][1]
					)
					return hasCoordinateInBbox
				}
			})
			return [...memo, ...found]
		}, [])
	)
	console.timeLog('routes' + rand)
	const routeIds = routes.map((route) => route.properties.route_id)
	console.log('routes', routeIds, unique(routeIds))

	return (
		<section>
			<section>
				<h2>Plans disponibles</h2>
				{false && <DateSelector type="day" date={day} />}
				{selectedAgency == null && data?.length > 0 && (
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
			{data?.length > 0 && !routesDemanded && selectedAgency != null && (
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
					setRoutes={(routes, url = true) => setSearchParams({ routes }, url)}
					setStopName={(stopName, url = true) =>
						setSearchParams({ arret: stopName }, url)
					}
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
