import { nowStamp } from '../itinerary/motisRequest'
import { nowAsYYMMDD } from './stop/Route'

export default function DayView({ data }) {
	const now = new Date().getTime()
	const startOfDay = (now - (now % 86400000)) / 1000
	const endDate = startOfDay + 86400

	const secondsRange = endDate - startOfDay
	const today = nowAsYYMMDD('-')
	const goodDayData = data.filter((el) => el.day === today)
	console.log('purple', goodDayData)
	return (
		<div
			css={`
				width: 100%;
				ol {
					list-style-type: none;
				}
				position: relative;
			`}
		>
			<ol
				css={`
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					display: flex;
					li {
						text-align: center;
						height: 100%;
						line-height: 2rem;
					}
				`}
			>
				<li
					css={`
						/* this is au pif, use https://github.com/mourner/suncalc */
						width: 25%;
						background: var(--darkerColor);
					`}
				>
					🌜️
				</li>
				<li
					css={`
						width: 50%;
						background: beige;
					`}
				>
					🌞
				</li>
				<li
					css={`
						width: 25%;
						background: var(--darkerColor);
					`}
				>
					🌜️
				</li>
			</ol>
			<ol
				css={`
					border: 2px solid var(--darkerColor);
					height: 2rem;
					position: relative;
				`}
			>
				{goodDayData.map(({ arrivalDate }) => {
					const stopSeconds = seconds(arrivalDate)

					const position = ((stopSeconds - startOfDay) / secondsRange) * 100
					return (
						<li
							key={seconds}
							css={`
								position: absolute;
								left: ${position}%;
								width: 0px;
								height: 100%;
								border-left: 1px solid
									${position > 75 || position < 25
										? 'beige'
										: 'var(--darkerColor)'};
							`}
						></li>
					)
				})}
			</ol>
		</div>
	)
}

const seconds = (date) => date.getTime() / 1000
