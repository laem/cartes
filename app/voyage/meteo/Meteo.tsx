import { sortBy } from 'ramda'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MapButton } from '@/components/voyage/MapButtons'

const buildIconUrl = (icon) =>
	'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/weather/' +
	icon +
	'.svg'
export default function Meteo({ coordinates }) {
	const [data, setData] = useState(null)

	useEffect(() => {
		if (!coordinates) return
		//https://github.com/hacf-fr/meteofrance-api/blob/master/src/meteofrance_api/const.py#L1-L8
		const domain = `https://webservice.meteofrance.com`

		const rainUrl =
			domain +
			`/nowcast/rain?lon=${coordinates[0]}&lat=${coordinates[1]}&token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__`
		const forecastUrl =
			domain +
			`/forecast?lon=${coordinates[0]}&lat=${coordinates[1]}&token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__`

		const queries = [
			//['rain', rainUrl], // looks like rain forecast is now in weather
			//forecast !
			['weather', forecastUrl],
		]
		queries.map(async ([key, url]) => {
			const request = await fetch(url)
			const json = await request.json()
			setData((data) => ({ ...data, [key]: json }))
		})
	}, [setData, coordinates])

	console.log('meteo', data)
	if (!data?.weather) return
	const { weather } = data
	const now = new Date()
	const relevantSorted = sortBy((forecast) => forecast.date)(
		weather.forecast
			.map((forecast) => ({ ...forecast, date: new Date(forecast.dt * 1000) }))
			.filter((forecast) => forecast.date > now)
	)

	const thisHour = relevantSorted[0]
	console.log('meteo forecast', relevantSorted)
	const isRaining = thisHour.rain['1h'] > 0,
		rainIcon = isRaining
			? 'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/rain/pluie-moderee.svg'
			: 'https://meteofrance.com/modules/custom/mf_tools_common_theme_public/svg/rain/pas-de-pluie.svg'

	const rainAlt = isRaining
		? `Il pleuvra ${thisHour.rain['1h']} mm dans l'heure`
		: "Pas de pluie dans l'heure"
	const weatherText = `À ${
		weather.position.name
	}, tendance : ${thisHour.weather.desc.toLowerCase()}; ${rainAlt}. Source Météo-France`

	return (
		<div
			css={`
				position: fixed;
				padding: 0.1rem;
				width: 2rem;
				height: 3.6rem;
				right: -0.4rem;
				bottom: 1.6rem;
				> small {
					display: none !important;
				}
				> div {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-evenly;
				}

				@media (min-width: 800px) {
					bottom: 1rem;
					right: 0rem;
					width: 6rem;
					height: 4.2rem;
					> small {
						display: block !important;
					}

					> div {
						align-items: center;
						justify-content: center;
						flex-direction: row;
					}
				}
				transform: translateX(-50%) translateY(-50%);
				img {
					width: 1.8rem;
					height: auto;
					margin: 0 0.2rem;
					display: inline-block;
				}
				z-index: 10;
				filter: drop-shadow(0 0 0.75rem white);

				background: #ffffff85;
				border: 0px solid lightgrey;
				text-align: center;
				border-radius: 4px;
				box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
				small {
					white-space: nowrap;
					overflow-x: scroll;
					scrollbar-width: none; /* Firefox */

					max-width: 100%;
					display: block;
					height: 1.6rem;
					margin-top: 0.3rem;
				}
				small::-webkit-scrollbar {
					display: none; /* Safari and Chrome */
				}
			`}
			title={weatherText}
		>
			<small>{weather.position.name}</small>
			<div>
				<Image
					src={buildIconUrl(thisHour.weather.icon)}
					alt={thisHour.weather.desc}
					width="10"
					height="10"
				/>
				<Image
					src={rainIcon}
					width="10"
					height="10"
					alt={rainAlt}
					css={`
						background: var(--lighterColor);
						border-radius: 1rem;
						width: 1.3rem !important;
					`}
				/>
			</div>
		</div>
	)
}
