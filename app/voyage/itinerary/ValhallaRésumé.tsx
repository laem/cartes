import {
	computeHumanDistance,
	daysHoursMinutesFromSeconds,
} from '../RouteRésumé'
import { nowStamp } from './transit/motisRequest'

export default function ({ data }) {
	console.log('purple valhalla', data)
	if (!data || !data.trip || data.trip.status !== 0) return null

	const seconds = data.trip.summary.time,
		distance = data.distance * 1000,
		[humanDistance, unit] = computeHumanDistance(distance),
		[days, hours, minutes] = daysHoursMinutesFromSeconds(seconds)

	const arrivalTime = nowStamp() + +seconds,
		humanArrivalTime =
			!days &&
			new Date(arrivalTime * 1000).toLocaleString('fr-FR', {
				hour: 'numeric',
				minute: 'numeric',
			})

	return (
		<div>
			<p>
				En voiture, le trajet de{' '}
				<strong>
					{humanDistance}&nbsp;{unit}
				</strong>{' '}
				vous prendra{' '}
				<strong>
					{days ? days + ` jour${days > 1 ? 's' : ''}, ` : ''}
					{hours ? hours + ` h et ` : ''}
					{+minutes}&nbsp;min
				</strong>{' '}
				<small>(arrivée à {humanArrivalTime})</small>.
			</p>
		</div>
	)
}
