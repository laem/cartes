import { isOverflowX, isWhiteColor } from '@/components/css/utils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { findContrastedTextColor } from '@/components/utils/colors'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'
import DateSelector from '../DateSelector'
import BestConnection from './BestConnection'
import { LateWarning } from './LateWarning'
import TransitLoader from './TransitLoader'
import findBestConnection from './findBestConnection'
import transportIcon from './transportIcon'
import {
	connectionEnd,
	connectionStart,
	filterNextConnections,
	formatMotis,
	humanDuration,
} from './utils'

/* This is a megacomponent. Don't worry, it'll stay like this until the UX
 * decisions are stabilized. We don't have many users yet */

export default function Transit({ data, searchParams }) {
	if (data.state === 'loading') return <TransitLoader />
	if (data.state === 'error')
		return <p>Pas de transport en commun trouvé :( </p>
	if (!data?.connections || !data.connections.length)
		return (
			<p
				css={`
					margin-top: 1rem;
				`}
			>
				<small>
					💡 Les transports en commun ne sont disponible qu'en Bretagne pour
					l'instant. Car le développeur est breton et qu'il faut bien commencer
					quelque part :)
				</small>
			</p>
		)

	const nextConnections = filterNextConnections(data)
	if (nextConnections.length < 1)
		return (
			<section>
				<p>🫣 Pas de transport en commun à cette heure-ci</p>
				<DateSelector date={data.date} />
			</section>
		)

	const firstDate = connectionStart(nextConnections[0]) // We assume Motis orders them by start date, when you start to walk. Could also be intersting to query the first end date

	const bestConnection = findBestConnection(nextConnections)

	const firstStop = Math.min(
			...nextConnections.map(
				(connection) => connection.stops[0].departure.schedule_time
			)
		),
		lastStop = Math.max(
			...nextConnections.map(
				(connection) => connection.stops.slice(-1)[0].arrival.schedule_time
			)
		)

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
			<DateSelector date={data.date} />
			<div
				css={`
					p {
						text-align: right;
					}
				`}
			>
				<LateWarning firstDate={firstDate} date={data.date} />
			</div>
			{bestConnection && <BestConnection bestConnection={bestConnection} />}

			<TransitTimeline
				connections={nextConnections}
				date={data.date}
				selectedConnection={searchParams.choix || 0}
				connectionsTimeRange={{
					from: firstStop,
					to: lastStop,
				}}
			/>
		</div>
	)
}

const TransitTimeline = ({
	connections,
	date,
	connectionsTimeRange,
	selectedConnection,
}) => {
	const setSearchParams = useSetSearchParams()

	/* The request result's latest arrival date, usually too far, makes everything
	 * small
	 */
	const endTime = Math.max(
		...connections.map(({ stops }) => stops.slice(-1)[0].arrival.time)
	)

	const quickestConnection = connections.reduce(
			(memo, next) => (next.seconds < memo.seconds ? next : memo),
			{ seconds: Infinity }
		),
		quickest = quickestConnection.seconds

	const range = connectionsTimeRange.to - connectionsTimeRange.from

	/*
	 * quickest ->  60 % width
	 * range -> total %
	 * */
	return (
		<div
			css={`
				margin-top: 1rem;
				overflow-x: scroll;
				> ul {
					width: ${((range * 0.6) / quickest) * 100}%;
				}
			`}
		>
			<ul>
				{connections.map((el, index) => (
					<Connection
						connection={el}
						endTime={endTime}
						date={date}
						selected={+selectedConnection === index}
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

const Connection = ({
	connection,
	endTime,
	date,
	setSelectedConnection,
	index,
	connectionsTimeRange,
	selected,
}) => {
	return (
		<li
			css={`
				margin-bottom: 0.1rem;
				cursor: pointer;
				> div {
					${selected && `border: 2px solid var(--color);`}
				}
			`}
			onClick={() => setSelectedConnection(index)}
		>
			<Line
				connectionsTimeRange={connectionsTimeRange}
				transports={connection.transports}
				connection={connection}
				connectionRange={[
					connectionStart(connection),
					connectionEnd(connection),
				]}
			/>
		</li>
	)
}

const Line = ({
	connectionsTimeRange,
	connection,
	connectionRange: [from, to],
	transports,
}) => {
	const { from: absoluteFrom, to: absoluteTo } = connectionsTimeRange
	const length = absoluteTo - absoluteFrom

	const barWidth = ((to - from) / length) * 100,
		left = ((from - absoluteFrom) / length) * 100

	return (
		<div
			css={`
				height: 4rem;
				width: calc(100% - 4rem);
				padding: 0.4rem 0;
				margin: 0;
				margin-top: 0.3rem;
				position: relative;
				display: flex;
				align-items: center;
				background: white;
			`}
		>
			<div
				css={`
					position: absolute;
					left: calc(1rem + ${left}%);
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
								width: ${(transport.seconds / connection.seconds) * 100}%;
								height: 1.8rem;
								border-right: 2px solid white;
							`}
						>
							<TimelineTransportBlock transport={transport} />
						</li>
					))}
				</ul>
				<div
					css={`
						display: flex;
						justify-content: space-between;
						line-height: 1.2rem;
					`}
				>
					<small>{formatMotis(from)}</small>
					<small
						css={`
							color: #555;
						`}
					>
						{humanDuration(connection.seconds).single}
					</small>
					<small>{formatMotis(to)}</small>
				</div>
			</div>
		</div>
	)
}

export const TimelineTransportBlock = ({ transport }) => {
	const [constraint, setConstraint] = useState('none')
	const background = transport.route_color,
		color = transport.route_text_color

	const textColor =
		(color && (color !== background ? color : null)) ||
		findContrastedTextColor(background, true)

	const ref = useRef<HTMLDivElement>(null)
	const { width = 0, height = 0 } = useResizeObserver({
		ref,
		box: 'border-box',
	})
	const isOverflow = isOverflowX(ref.current)

	const displayImage = constraint === 'none'
	const name = transport.shortName?.toUpperCase().replace(/TRAM\s?/g, 'T')
	console.log('orange', transport, name)

	useEffect(() => {
		if (isOverflow)
			setConstraint(constraint === 'none' ? 'noImage' : 'smallest')
	}, [setConstraint, isOverflow, constraint])

	return (
		<span
			ref={ref}
			css={`
			${
				constraint == 'smallest' &&
				`
		  strong {
			  border: 2px solid white;
				z-index: 1
		  }
			`
			}
				display: inline-block;
				width: 100%;
				background: ${background};
				height: 100%;
				display: flex;
				justify-content: center;
				padding: 0.2rem 0;
				img {
					display: ${displayImage ? 'block' : 'none'};
					height: 0.8rem;
					width: auto;
					margin-right: 0.2rem;

${
	transport.frenchTrainType
		? `filter: brightness(0) invert(1);`
		: isWhiteColor(textColor) && `filter: invert(1)`
}
			`}
			title={`${humanDuration(transport.seconds).single} de ${
				transport.frenchTrainType || transport.move.name || 'marche'
			} ${transport.route_long_name || ''}`}
		>
			{transport.move.name ? (
				<span
					css={`
						display: flex;
						align-items: center;
					`}
				>
					<Image
						src={transportIcon(transport.frenchTrainType, transport.route_type)}
						alt="Icône d'un bus"
						width="100"
						height="100"
					/>
					<strong
						css={`
							background: ${background};
							color: ${textColor};
							line-height: 1.2rem;
							border-radius: 0.4rem;
							white-space: nowrap;
						`}
					>
						{transport.frenchTrainType || name}
					</strong>
				</span>
			) : transport.move_type === 'Walk' ? (
				<Image
					src={'/walking.svg'}
					alt="Icône d'une personne qui marche"
					width="100"
					height="100"
					css={`
						height: 1.4rem !important;

						margin: 0 !important;
					`}
				/>
			) : (
				correspondance[transport.move_type]
			)}
		</span>
	)
}
