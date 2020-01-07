import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'

export default function Activités() {
	let {
		state: {
			items,
			scenario: { quota }
		}
	} = useContext(StoreContext)
	return (
		<ul
			css={`
				flex-direction: column;
				justify-content: flex-start;
				height: 100vh;
				margin: 0;
				padding: 0;
				> li {
					line-height: 3rem;
					padding-left: 1rem;
					width: 100%;
					list-style-type: none;
				}
				img {
					font-size: 180%;
				}
			`}
		>
			{items.map(([text, icon, weight], i) => (
				<Activité
					key={text}
					{...{
						weight,
						quota,
						icon,
						i,
						// animate the last item added only.
						animate: items.length - 1 === i
					}}
				/>
			))}
			<Link to="/ajouter">
				<button
					css={`
						font-size: 300%;
						position: absolute;
						bottom: 1rem;
						right: 1rem;
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
		</ul>
	)
}
