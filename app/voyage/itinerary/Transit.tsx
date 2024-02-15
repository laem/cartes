import CircularIcon from '@/components/CircularIcon'
import Image from 'next/image'
import useSetSearchParams from '@/components/useSetSearchParams'
import DateSelector from './DateSelector'
import { stamp } from './motisRequest'
import TransitLoader from './TransitLoader'

export default function Transit({ data }) {
	if (data.state === 'loading') return <TransitLoader />
	if (data.state === 'error')
		return <p>Pas de transport en commun trouvé :( </p>
	const connections = data?.connections
	console.log('prune motis', data)
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
			<LateWarning firstDate={firstDate} date={data.date} />
			<DateSelector date={data.date} />

			<Connections
				connections={connections}
				date={data.date}
				connectionsTimeRange={{
					from: data.interval_begin,
					to: data.interval_end,
				}}
			/>
		</div>
	)
}

const LateWarning = ({ date, firstDate }) => {
	const diffHours = (firstDate - stamp(date)) / (60 * 60)

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

const Connections = ({ connections, date, connectionsTimeRange }) => {
	const setSearchParams = useSetSearchParams()

	/* The request result's latest arrival date, usually too far, makes everything
	 * small
	 */
	const endTime = Math.max(
		...connections.map(({ stops }) => stops.slice(-1)[0].arrival.time)
	)

	return (
		<div
			css={`
				margin-top: 1rem;
				overflow-x: scroll;
				> ul {
					width: 300%;
				}
			`}
		>
			<ul>
				{connections.map((el, index) => (
					<Connection
						connection={el}
						endTime={endTime}
						date={date}
						setSelectedConnection={(choix) => setSearchParams({ choix })}
						index={index}
						connectionsTimeRange={connectionsTimeRange}
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

const transportRelativeRatio = (transport, transports) => {
	const sum = transports.reduce((memo, next) => memo + next.seconds, 0)

	const ratio = transport.seconds / sum
	return ratio
}
const formatMotis = (timestamp) =>
	startDateFormatter.format(dateFromMotis(timestamp))

const Connection = ({
	connection,
	endTime,
	date,
	setSelectedConnection,
	index,
	connectionsTimeRange,
}) => {
	return (
		<li
			css={`
				margin-bottom: 0.1rem;
				cursor: pointer;
			`}
			onClick={() => setSelectedConnection(index)}
		>
			<Frise
				range={[stamp(date), endTime]}
				transports={connection.transports}
				connection={[connectionStart(connection), connectionEnd(connection)]}
			/>
		</li>
	)
}

const connectionStart = (connection) => connection.stops[0].departure.time

const connectionEnd = (connection) => connection.stops.slice(-1)[0].arrival.time

const Frise = ({
	range: [rangeFrom, rangeTo],
	connection: [from, to],
	transports,
}) => {
	const length = rangeTo - rangeFrom

	const barWidth = ((to - from) / length) * 100,
		left = ((from - rangeFrom) / length) * 100
	return (
		<div
			css={`
				height: 4rem;
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
					top: 50%;
					transform: translateY(-50%);
				`}
			>
				<ul
					css={`
						display: flex;
						justify-content: space-evenly;
						list-style-type: none;
						align-items: center;
						width: 100%;
					`}
				>
					{transports.map((transport) => (
						<li
							css={`
								width: ${transportRelativeRatio(transport, transports) * 100}%;
								height: 1.8rem;
							`}
						>
							<Transport transport={transport} />
						</li>
					))}
				</ul>
				<div
					css={`
						display: flex;
						justify-content: space-between;
					`}
				>
					<small css={``}>{formatMotis(from)}</small>
					<small css={``}>{formatMotis(to)}</small>
				</div>
			</div>
		</div>
	)
}
const Transport = ({ transport }) => {
	const background = transport.route_color || 'rgb(211, 178, 238)'

	const minutes = Math.round(transport.seconds / 60)
	return (
		<span
			css={`
				display: inline-block;
				width: 100%;
				background: ${background};
				height: 100%;
				display: flex;
				justify-content: center;
				padding: 0.2rem 0;
				img {
					width: 1rem;
					height: auto;
					margin-right: 0.2rem;

					filter: invert(
						${transport.route_text_color?.toLowerCase() === 'ffffff' ? 0 : 1}
					);
				}
			`}
			title={`${minutes} min de ${
				transport.frenchTrainType || transport.move.name
			}`}
		>
			{transport.move.name ? (
				<span
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<Image
						src={transportIcon(transport.route_type)}
						alt="Icône d'un bus"
						width="100"
						height="100"
					/>
					<strong
						css={`
							background: ${background};
							color: ${transport.route_text_color
								? transport.route_text_color
								: 'white'};
							line-height: 1.2rem;
							border-radius: 0.4rem;
							text-transform: uppercase;
						`}
					>
						{transport.frenchTrainType || transport.shortName}
					</strong>
				</span>
			) : transport.move_type === 'Walk' ? (
				<Image
					src={'/walking.svg'}
					alt="Icône d'une personne qui marche"
					width="100"
					height="100"
					css={`
						width: 1.6rem !important;
					`}
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
