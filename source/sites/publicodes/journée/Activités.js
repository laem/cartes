import { setSimulationConfig } from 'Actions/actions'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import scenarios from '../scenarios.yaml'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'

export default function Activités() {
	let {
			state: { items, scenario }
		} = useContext(StoreContext),
		quota = scenarios[scenario]['crédit carbone par personne'],
		dispatch = useDispatch(),
		analysis = useSelector(analysisWithDefaultsSelector),
		targets = analysis.targets

	useEffect(() => {
		dispatch(setSimulationConfig({ objectifs: items }))
	}, [])

	console.log(analysis)

	return (
		<ul
			css={`
				flex-direction: column;
				justify-content: flex-start;
				height: 100vh;
				width: 100vw;
				margin: 0;
				padding: 0;
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
				}
			`}
		>
			{!items.length && (
				<p>
					Ajoutez des activités pour connaître votre impact personnel sur le
					climat {emoji('🌍🌳🐨')}{' '}
				</p>
			)}
			{targets.map((item, i) => (
				<Activité
					key={item.dottedName}
					{...{
						item,
						quota,
						i,
						// animate the last item added only.
						animate: items.length - 1 === i
					}}
				/>
			))}
			<Link to="/journée/ajouter">
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
