import Image from 'next/image'
import triangle from '@/public/triangle.svg'
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
				margin: 0.4rem 0;
				width: 100%;
				ol {
					list-style-type: none;
				}
				position: relative;
			`}
		>
			<ol
				css={`
					width: 100%;
					height: 100%;
					display: flex;
					li {
						text-align: center;
						height: 100%;
						line-height: 1rem;
						font-size: 85%;

						display: flex;
						justify-content: space-between;
						align-items: center;
						color: white;
						padding: 0 0.1rem;
						span:first-child,
						span:last-child {
							font-size: 85%;
						}
					}
					border: 1px solid var(--darkerColor);
				`}
			>
				<li
					css={`
						/* this is au pif, use https://github.com/mourner/suncalc */
						width: ${((8 - 2) / 24) * 100}%;
						background: var(--darkerColor);
					`}
				>
					<span>2h</span>
					<span>🌜️</span>
					<span>8h</span>
				</li>
				<li
					css={`
						width: ${((20 - 8) / 24) * 100}%;
						background: beige;
					`}
				>
					<span></span>
					<span>🌞</span>
					<span></span>
				</li>
				<li
					css={`
						width: ${((26 - 20) / 24) * 100}%;
						background: var(--darkerColor);
					`}
				>
					<span>20h</span>
					<span>🌜️</span>
					<span>2h</span>
				</li>
			</ol>
			<ol
				css={`
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
								height: fit-content;
								line-height: 0;
								img {
									width: 0.4rem;
									height: 0.4rem;
									opacity: 0.4;
								}
							`}
						>
							<Image src={triangle} alt="" />
						</li>
					)
				})}
			</ol>
		</div>
	)
}

const seconds = (date) => date.getTime() / 1000
