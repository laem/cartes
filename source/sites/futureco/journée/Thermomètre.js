import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import scenarios from '../scenarios.yaml'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'

export const limitReached = (analysis, quota) => {
	const footprint = analysis.reduce(
			(memo, item) => memo + item.targets[0].nodeValue,
			0
		),
		result = footprint > (quota * 1000) / 365
	return result
}

export default function Thermomètre({ analysis }) {
	let {
			state: { items, scenario }
		} = useContext(StoreContext),
		quota = scenarios[scenario]['crédit carbone par personne']

	return (
		<div>
			<AddButton />

			{!items.length && (
				<p
					css={`
						padding: 0.4rem;
						background: var(--color);
						color: white;
						line-height: 1.5rem;
						position: absolute;
						top: 46%;
						width: 100%;
						text-align: center;
					`}
				>
					Ajoute ce que tu as fait aujourd'hui pour connaître ton impact sur le
					climat {emoji('🌍🌳🐨')}{' '}
				</p>
			)}
			{true && (
				<div
					css={`
						position: absolute;
						top: 50%;
						color: white;
						background: black;
						width: 100%;
						text-align: center;
						padding-left: 0.6rem;
					`}
				>
					Limite pour une planète à +1.5°
				</div>
			)}
			{items.length > 0 && (
				<ul
					css={`
						display: flex;
						flex-direction: column-reverse;
						justify-content: flex-start;
						min-height: 100vh;
						min-height: -webkit-fill-available;
						width: 100vw;
						margin: 0;
						padding: 0;
						background: red;
						background: linear-gradient(
							0deg,
							rgba(255, 192, 0, 1) 0%,
							rgba(255, 0, 0, 1) 50%,
							rgba(0, 0, 0, 1) 100%
						);
						> li {
							line-height: 3rem;
							padding-left: 1rem;
							width: 100%;
							list-style-type: none;
						}
						li img {
							font-size: 180%;
						}
						p {
							max-width: 25rem;
							text-align: center;
							margin: 0 auto;
							color: white;
						}
					`}
				>
					{analysis.map((item, i) => (
						<Activité
							key={item.targets[0].dottedName}
							{...{
								item,
								quota,
								i,
								// animate the last item added only.
								animate: items.length - 1 === i
							}}
						/>
					))}
					<li
						css={`
							flex-grow: 1;
							background: white;
							display: flex;
							justify-content: center;
							align-items: center;
						`}
					></li>
				</ul>
			)}
		</div>
	)
}

const AddButton = () => (
	<div
		css={`
			position: absolute;
			bottom: 1rem;
			right: 1rem;

			button {
				padding: 0;
				border-radius: 10rem !important;
				width: 7rem;
				height: 7rem;
				background: var(--color);
				color: var(--textColor);
				box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
					0 1px 2px rgba(41, 117, 209, 0.24);
				font-size: 300%;
			}
		`}
	>
		<Link to="/journée/ajouter">
			<button>+</button>
		</Link>
	</div>
)
