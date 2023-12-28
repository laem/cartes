import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import { findContrastedTextColor } from '@/components/utils/colors'
import { useState } from 'react'

const nowAsYYMMDD = () => {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear()

	if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	return [year, month, day].join('')
}

const timeFromHHMMSS = (hhmmss) => {
	let [hours, minutes, seconds] = hhmmss.split(':')

	return [hours, minutes, seconds]
}
const toDate = ({ year, month, day }, time) => {
	return new Date(+year, +month - 1, +day, ...time)
}
export default function TransportRoute({ route, stops }) {
	const [calendarOpen, setCalendarOpen] = useState(false)
	const now = new Date()
	const augmentedStops = stops
		.map((stop) => {
			const time = timeFromHHMMSS(stop.arrival_time)

			// in Bretagne unified GTFS, all the GTFS are normalized to use this technique to specify trip days
			const calendarDate = stop.trip.calendarDates[0].date
			const serializedDay = '' + calendarDate,
				year = serializedDay.slice(0, 4),
				month = serializedDay.slice(4, 6),
				day = serializedDay.slice(6)
			const arrivalDate = toDate({ year, month, day }, time)

			const isFuture = arrivalDate > now

			return {
				...stop,
				isFuture,
				arrivalDate,
			}
		})
		.filter((el) => el.isFuture)

	/*
	const byArrivalDate = new Map(
		augmentedStops.map((el) => {
			return [el.arrival_time, el]
		})
	)
	*/

	const stopSelection = augmentedStops
		.sort((a, b) => a.arrivalDate - b.arrivalDate)
		.slice(0, 4)

	const color = route.route_color
		? findContrastedTextColor(route.route_color, true)
		: '#ffffff'
	const backgroundColor = route.route_color ? `#${route.route_color}` : 'grey'
	return (
		<li
			css={`
				margin-top: 0.8rem;
			`}
		>
			<small
				css={`
					strong {
						background: ${backgroundColor};
						padding: 0 0.2rem;
						border-radius: 0.3rem;
						color: ${color};
					}
					span {
						text-decoration: underline;
						text-decoration-color: ${backgroundColor};
						text-decoration-thickness: 2px;
					}
					white-space: nowrap;
					width: 100%;
					overflow: scroll;
					height: 1.2rem;
					&::-webkit-scrollbar {
						display: none;
					}
					scrollbar-width: none;
				`}
			>
				🚍️ <strong>{route.route_short_name}</strong>{' '}
				<span>{route.route_long_name}</span>
			</small>
			<ul
				css={`
					display: flex;
					justify-content: end;
					list-style-type: none;
					li {
						margin-right: 0.6rem;
						border-right: 2px solid var(--lighterColor);
						padding-right: 0.6rem;
						line-height: 1rem;
						display: flex;
						align-items: center;
					}
					li:last-child {
						border-right: none;
					}
				`}
			>
				{stopSelection.map((stop, i) => (
					<li key={stop.trip_id}>
						<StopTime stop={stop} doPrefix={i === 0} />
					</li>
				))}
				<button onClick={() => setCalendarOpen(!calendarOpen)}>
					<Emoji e="🗓️" />
				</button>
			</ul>
		</li>
	)
}

const StopTime = ({ stop, doPrefix }) => {
	const d = stop.arrivalDate
	const now = new Date()

	const seconds = (d.getTime() - now.getTime()) / 1000
	const minutes = seconds / 60

	const prefix = doPrefix ? 'Dans ' : ''

	if (seconds < 60)
		return (
			<small>
				{prefix}
				{Math.round(seconds)} sec
			</small>
		)
	if (minutes < 60)
		return (
			<small>
				{prefix}
				{Math.round(minutes)} min
			</small>
		)

	const prefix2 = doPrefix ? 'À ' : ''
	const hours = d.getHours(),
		humanHours = +hours >= 10 ? hours : '0' + hours
	const human = `${prefix2}${humanHours}h${d.getMinutes()}`

	return <small>{human}</small>
}
