import CircularIcon from '@/components/CircularIcon'
import { useEffect, useState } from 'react'
import { initialDate } from '../GareInfo'
import { nowStamp } from './motisRequest'
import TransitLoader from './TransitLoader'

export default function Transit({ data }) {
	if (data.state === 'loading') return <TransitLoader />
	if (data.state === 'error')
		return <p>Pas de transport en commun trouvé :( </p>
	const connections = data?.connections
	console.log('motis', data)
	if (!connections?.length) return null

	const firstDate = connectionStart(connections[0]) // We assume Motis orders them by start date, when you start to walk. Could also be intersting to query the first end date

	return (
		<div
			css={`
				margin-top: 1rem;
				ul {
					list-style-type: none;
				}
				input {
					margin: 0 0 0 auto;
					display: block;
				}
			`}
		>
			<p>Il existe des transports en commun pour ce trajet. </p>
			<LateWarning date={firstDate} />

			<input
				type="datetime-local"
				id="trainDate"
				name="trainDate"
				value={data.date}
				min={initialDate}
				onChange={(e) => data.setDate(e.target.value)}
			/>
			<Connections
				connections={connections}
				date={data.date}
				setSelectedConnection={data.setSelectedConnection}
			/>
		</div>
	)
}
const LateWarning = ({ date }) => {
	const diffHours = (date - nowStamp()) / (60 * 60)

	const displayDiff = Math.round(diffHours)
	if (diffHours > 12)
		return <p>😓 Le prochain trajet est dans plus de {displayDiff} heures</p>
	if (diffHours > 4)
		return <p> 😔 Le prochain trajet est dans plus de {displayDiff} heures</p>
	if (diffHours > 2)
		return <p> ⏳ Le prochain trajet est dans plus de {displayDiff} heures</p>
	if (diffHours > 1)
		return <p> ⏳ Le prochain trajet est dans plus d'une heure</p>
	return null
}

const Connections = ({ connections, date, setSelectedConnection }) => {
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
				{connections.map((el, index) => (
					<Connection
						connection={el}
						endTime={endTime}
						date={date}
						setSelectedConnection={setSelectedConnection}
						index={index}
					/>
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
const Connection = ({
	connection,
	endTime,
	date,
	setSelectedConnection,
	index,
}) => (
	<li
		css={`
			margin-bottom: 1.4rem;
			cursor: pointer;
		`}
		onClick={() => setSelectedConnection(index)}
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
					<Transport transport={transport} />
				</li>
			))}
		</ul>
		<Frise
			range={[Math.round(new Date(date).getTime() / 1000), endTime]}
			connection={[connectionStart(connection), connectionEnd(connection)]}
		/>
	</li>
)

const connectionStart = (connection) => connection.stops[0].departure.time

const connectionEnd = (connection) => connection.stops.slice(-1)[0].arrival.time

const Transport = ({ transport }) => {
	const background = transport.route_color
		? `#${transport.route_color}`
		: 'var(--darkColor)'

	const transportType = transport.trip && transport.trip.id.id.split('_')[0],
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
						src={transportIcon(transport.route_type)}
						alt="Icône d'un bus"
						background={background}
						black={transport.route_text_color?.toLowerCase() !== 'ffffff'}
					/>
					<small
						css={`
							background: ${background};
							color: ${transport.route_text_color
								? '#' + transport.route_text_color
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
