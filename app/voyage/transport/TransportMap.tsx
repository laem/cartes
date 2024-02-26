import DateSelector from '../itinerary/DateSelector'

export default function TransportMap({ day }) {
	return (
		<section>
			<h2>Explorer les transports en commun</h2>
			<DateSelector type="day" date={day} />
		</section>
	)
}
