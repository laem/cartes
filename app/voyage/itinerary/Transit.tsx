import CircularIcon from '@/components/CircularIcon'
import { useEffect, useState } from 'react'

export default function Transit({ data }) {
	if (data === 'loading') return <div>Transports en commun en cours</div>
	const connections = data?.connections
	console.log('motis', data)
	if (!connections?.length) return null
	return (
		<div
			css={`
				margin-top: 1rem;
				ul {
					list-style-type: none;
				}
			`}
		>
			<p>Il existe aussi des transports en commun pour ce trajet. </p>
			<Connections connections={connections} />
		</div>
	)
}

const Connections = ({ connections }) => {
	const endTime = Math.max(
		...connections.map(({ stops }) => stops.slice(-1)[0].arrival.time)
	)
	return (
		<div
			css={`
				margin-top: 1rem;
			`}
		>
			<ul>
				{connections.map((el) => (
					<Connection connection={el} endTime={endTime} />
				))}
			</ul>
		</div>
	)
}

const correspondance = { Walk: 'Marche', Transport: 'Transport' }

const startDateFormatter = Intl.DateTimeFormat('fr-FR', {
	hour: 'numeric',
	minute: 'numeric',
})
const dateFromMotis = (timestamp) => new Date(timestamp * 1000)
const formatMotis = (timestamp) =>
	startDateFormatter.format(dateFromMotis(timestamp))
const Frise = ({ range: [rangeFrom, rangeTo], connection: [from, to] }) => {
	const length = rangeTo - rangeFrom

	const barWidth = ((to - from) / length) * 100,
		left = ((from - rangeFrom) / length) * 100
	return (
		<div
			css={`
				height: 1.1rem;
				width: calc(100% - 4rem);
				margin: 0 2rem;
				margin-top: 0.4rem;
				position: relative;
				display: flex;
				align-items: center;
				background: white;
			`}
		>
			<div
				css={`
					position: absolute;
					left: ${left}%;
					width: ${barWidth}%;
					height: 0.6rem;
					background: var(--darkColor);
					top: 50%;
					transform: translateY(-50%);
				`}
			>
				<small
					css={`
						position: absolute;
						right: calc(100% + 0.4rem);
						top: 50%;
						transform: translateY(-50%);
					`}
				>
					{formatMotis(from)}
				</small>
				<small
					css={`
						position: absolute;
						left: calc(100% + 0.4rem);
						top: 50%;
						transform: translateY(-50%);
					`}
				>
					{formatMotis(to)}
				</small>
			</div>
		</div>
	)
}
const Connection = ({ connection, endTime }) => (
	<li
		css={`
			margin-bottom: 1.4rem;
		`}
	>
		<ul
			css={`
				display: flex;
				justify-content: space-evenly;
				list-style-type: none;
				align-items: center;
			`}
		>
			{connection.transports.map((transport) => (
				<li>
					<Transport
						transport={transport}
						trip={connection.trips.find(
							(trip) => trip.id.line_id === transport.move.line_id
						)}
					/>
				</li>
			))}
		</ul>
		<Frise
			range={[Math.round(Date.now() / 1000), endTime]}
			connection={[
				connection.stops[0].departure.time,
				connection.stops.slice(-1)[0].arrival.time,
			]}
		/>
	</li>
)

const Transport = ({ transport, trip }) => {
	const [attributes, setAttributes] = useState({})

	const tripId = trip?.id.id.split('_')[1] // `bretagne_` prefix added by Motis it seems, coming from its config.ini file that names schedules with ids
	useEffect(() => {
		if (!tripId) return
		const doFetch = async () => {
			try {
				const request = await fetch(
					`https://gtfs-server.osc-fr1.scalingo.io/routes/trip/${tripId}`
				)
				const json = await request.json()
				const safeAttributes = json.routes[0] || {}
				setAttributes(safeAttributes)
			} catch (e) {
				console.error('Unable to fetch route color from GTFS server')
			}
		}
		doFetch()
	}, [tripId, setAttributes])

	const background = attributes.route_color
		? `#${attributes.route_color}`
		: 'var(--darkColor)'

	const transportType = trip && trip.id.id.split('_')[0],
		frenchTrainType = transportType && { tgv: 'TGV', ter: 'TER' }[transportType]
	return (
		<span>
			{transport.move.name ? (
				<span
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<CircularIcon
						givenSize={'1.8rem'}
						padding=".4rem"
						src={transportIcon(attributes.route_type)}
						alt="Icône d'un bus"
						background={background}
						black={attributes.route_text_color?.toLowerCase() !== 'ffffff'}
					/>
					<small
						css={`
							background: ${background};
							color: ${attributes.route_text_color
								? '#' + attributes.route_text_color
								: 'white'};
							padding: 0 0.4rem;
							line-height: 1.2rem;
							border-radius: 0.4rem;
						`}
					>
						{frenchTrainType || transport.move.name}
					</small>
				</span>
			) : transport.move_type === 'Walk' ? (
				<CircularIcon
					givenSize={'1.25rem'}
					src={'/walking.svg'}
					padding=".05rem"
					alt="Icône d'une personne qui marche"
					background={background}
				/>
			) : (
				correspondance[transport.move_type]
			)}
		</span>
	)
}

//TODO complete with spec possibilities https://gtfs.org/fr/schedule/reference/#routestxt
const transportIcon = (routeType) => {
	if (!routeType) return '/icons/bus.svg'
	const found = { 0: '/icons/bus.svg', 1: '/icons/subway.svg' }[routeType]
	return found || '/icons/bus.svg'
}
