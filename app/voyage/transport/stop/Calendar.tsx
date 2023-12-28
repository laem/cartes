import css from '@/components/css/convertToJs'
import { useState } from 'react'
import { nowAsYYMMDD } from './Route'

export default function Calendar({ data }) {
	console.log('DD', data)
	const today = nowAsYYMMDD('-')
	const [day, setDay] = useState(today)

	const actualTimes = data.filter((el) =>
		el.trip.calendarDates.find((d) => d.date === +day.replace(/-/g, ''))
	)

	// 48 and not 24, because the bus passing at 2h this night will be marked as
	// passing at 25h
	const hours = [...Array(48).keys()].map((hour) => {
		const str = '' + hour

		return str.length === 1 ? '0' + hour : hour
	})

	const hoursObject = Object.fromEntries(hours.map((h) => [h, []]))

	const stopByHour = actualTimes.reduce((memo, next) => {
		const thisHour = next.arrival_time.split(':')[0]
		console.log('DD', thisHour, Object.keys(hoursObject))
		return { ...memo, [thisHour]: [...memo[thisHour], next] }
	}, hoursObject)

	console.log('DD', stopByHour)

	return (
		<div>
			<input
				type="date"
				id="busStopTimesDate"
				name="busStopTimesDate"
				value={day}
				min={today}
				onChange={(e) => setDay(e.target.value)}
				style={css`
					cursor: pointer;
					margin-top: 0.6rem;
					display: block;
					margin: auto 0 auto auto;
				`}
			/>
			<div
				css={`
					max-width: 100%;
					white-space: nowrap;
					overflow: scroll;
				`}
			>
				<ul
					css={`
						margin-top: 0.6rem;
						display: flex;
						width: auto;
						scrollbar-width: none;
						list-style-type: none;
						text-align: center;
						li {
							padding: 0;
						}
						> li > strong {
							font-size: 90%;
							background: var(--darkColor);
							color: var(--lightestColor);
							width: 2.6rem;
							display: block;
							border-right: 2px solid var(--lighterColor);
						}
						> li:nth-child(even) {
							background: var(--lighterColor);
						}

						ul {
							display: flex;
							list-style-type: none;
							flex-direction: column;
						}
					`}
				>
					{Object.entries(stopByHour).map(
						([hour, entries]) =>
							entries.length > 0 && (
								<li key={hour}>
									<strong>{hour % 24} h</strong>
									<ul>
										{entries.map((entry) => (
											<li key={entry.arrival_time}>
												{entry.arrival_time.split(':')[1]}
											</li>
										))}
									</ul>
								</li>
							)
					)}
				</ul>
			</div>
		</div>
	)
}
