import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import Image from 'next/image'
import DateSelector from '../itinerary/DateSelector'
import SncfSelect from './SncfSelect'
import TransitFilter, { transitFilters } from './TransitFilter'
import { sortBy, unique } from '@/components/utils/utils'
import StopByName from './StopByName'
import { ModalCloseButton } from '../UI'
import Routes from './TransportMapRoutes'
import { PlaceButton } from '../PlaceButtonsUI'

export default function TransportMap({
	day,
	data,
	selectedAgency,
	routesParam,
	trainType,
	transitFilter,
	stop,
	bbox,
	setIsItineraryMode,
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

					const hasCoordinateInBbox = !bbox
						? true
						: feature.geometry.coordinates.some(
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

	const selectedAgencyData =
		selectedAgency &&
		data?.length > 0 &&
		data.find(([id]) => id === selectedAgency)
	return (
		<section>
			<section>
				{!selectedAgencyData && (
					<header
						css={`
							h1 {
								margin-bottom: -0.5rem;
							}
							margin-bottom: 1rem;
						`}
					>
						<h1>Plans de transport en commun</h1>
						<Link href="/transport-en-commun">
							<small>Quels réseaux sont intégrés sur Cartes ? </small>
						</Link>
					</header>
				)}

				<PlaceButton
					as="div"
					css={`
						margin-bottom: 0.6rem;
					`}
				>
					<button onClick={() => setIsItineraryMode(true)}>
						<div>
							<Image
								src="/itinerary.svg"
								width="50"
								height="50"
								alt="Lancer le mode itinéraire"
							/>
						</div>
						<div>Itinéraire</div>
					</button>
				</PlaceButton>
				{false && <DateSelector type="day" date={day} />}
				{selectedAgency == null && data?.length > 0 && (
					<section>
						<p>Dans cette zone : </p>
						<ol
							css={`
								margin-left: 0.6rem;
								list-style-type: none;
								a {
									color: var(--color);
									text-decoration-color: var(--lighterColor);
								}
							`}
						>
							{data.map(([agencyId, { agency }]) => (
								<li key={agencyId}>
									<Link href={setSearchParams({ agence: agencyId }, true)}>
										{agency.agency_name}
									</Link>
								</li>
							))}
						</ol>
					</section>
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
			{!routesDemanded && selectedAgencyData && (
				<Agency
					data={selectedAgencyData[1]}
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
			<Link href={backUrl}>← Retour à la liste des plans des réseaux</Link>
			<h1>{data.agency.agency_name}</h1>
		</section>
	)
}
