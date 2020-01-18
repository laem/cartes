import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import scenarios from '../scenarios.yaml'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'

export default function Activités({ analysis }) {
	let {
			state: { items, scenario }
		} = useContext(StoreContext),
		quota = scenarios[scenario]['crédit carbone par personne']

	return (
		<ul
			css={`
				display: flex;
				flex-direction: column-reverse;
				justify-content: flex-start;
				height: 100vh;
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
			{!items.length && (
				<p>
					Ajoute tes activités du jour pour connaître ton impact sur le climat{' '}
					{emoji('🌍🌳🐨')}{' '}
				</p>
			)}

			{(analysis || []).map((item, i) => (
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
			>
				<AddButton />
			</li>
		</ul>
	)
}

const AddButton = () => (
	<Link to="/journée/ajouter">
		<button
			css={`
				font-size: 300%;
				padding: 0;
				border-radius: 10rem !important;
				width: 7rem;
				height: 7rem;
				background: var(--color);
				color: var(--textColor);
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
					0 1px 2px rgba(41, 117, 209, 0.24);
			`}
		>
			+
		</button>
	</Link>
)
