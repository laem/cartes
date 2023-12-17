import { findContrastedTextColor } from '@/components/utils/colors'

const time = (hhmmss) => {
	let d = new Date() // Creates a Date Object using the clients current time

	let [hours, minutes, seconds] = hhmmss.split(':')

	d.setHours(+hours) // Set the hours, using implicit type coercion
	d.setMinutes(minutes) // can pass Number or String - doesn't really matter
	d.setSeconds(seconds)
	return d
}
export default function TransportRoute({ route, stops }) {
	const now = new Date()
	const augmentedStops = stops
		.map((stop) => {
			const arrivalTime = time(stop.arrival_time)
			const isFuture = arrivalTime > now

			return { ...stop, isFuture, arrivalTime }
		})
		.filter((el) => el.isFuture)

	// don't know why in Rennes, you get multiple trips on one stop with the same arrival date
	const byArrivalDate = new Map(
		augmentedStops.map((el) => [el.arrival_time, el])
	)

	const stopSelection = [...byArrivalDate.values()]
		.sort((a, b) => a.arrivalTime - b.arrivalTime)
		.slice(0, 4)

	console.log(stopSelection)
	return (
		<li>
			<small
				css={`
					background: ${route.route_color ? `#${route.route_color}` : 'grey'};
					padding: 0 0.2rem;
					border-radius: 0.3rem;
					color: ${route.route_color
						? findContrastedTextColor(route.route_color, true)
						: '#ffffff'};
				`}
			>
				🚍️ <strong>{route.route_short_name}</strong> {route.route_long_name}
			</small>
			<ul
				css={`
					display: flex;
					list-style-type: none;
					li {
						margin-right: 0.6rem;
					}
				`}
			>
				{stopSelection.map((stop, i) => (
					<li key={stop.trip_id}>
						{i > 0 && '- '}
						<Stop stop={stop} />
					</li>
				))}
			</ul>
		</li>
	)
}

const Stop = ({ stop }) => {
	const d = stop.arrivalTime
	const now = new Date()

	const seconds = (d.getTime() - now.getTime()) / 1000
	const minutes = seconds / 60

	if (seconds < 60) return <small>Dans {Math.round(seconds)} seconds</small>
	if (minutes < 60) return <small>Dans {Math.round(minutes)} minutes</small>

	console.log(d.getHours())
	const human = `À ${d.getHours()} h ${d.getMinutes()} min`

	return <small>{human}</small>
}
