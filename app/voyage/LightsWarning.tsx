import sunCalc from 'suncalc'

const dateFormatter = Intl.DateTimeFormat('fr-FR', {
	hour: 'numeric',
	minute: 'numeric',
})
export default function LightsWarning({ longitude, latitude }) {
	// These times seem more secure than sunrise and sunset
	const { goldenHourEnd, goldenHour } = sunCalc.getTimes(
		new Date(),
		latitude,
		longitude
	)

	return (
		<div
			css={`
				margin-top: 0.6rem;
			`}
		>
			<span>
				N'oubliez pas vos lumières avant {dateFormatter.format(goldenHourEnd)}{' '}
				et après {dateFormatter.format(goldenHour)}
			</span>
		</div>
	)
}
