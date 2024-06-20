import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import DateSelector from '../itinerary/DateSelector'
import SncfSelect from './SncfSelect'
import TransitFilter, { transitFilters } from './TransitFilter'
import { sortBy } from '@/components/utils/utils'
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

	return (
		<section>
			<section>
				<h2>Plans disponibles</h2>
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
