import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import scenarios from '../scenarios.yaml'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'
import LimitReached from './Limit'
import { splitEvery } from 'ramda'

const footprint = (analysis) =>
	analysis.reduce((memo, item) => memo + item.targets[0].nodeValue, 0)

const blockWidth = 10

export const limitReached = (analysis, quota) =>
	footprint(analysis) > (quota * 1000) / 365
// This tool is awesome to create pallettes
// https://gka.github.io/palettes/#/10|d|ffa700,ff0000|ff0000,000000|1|1
const colors = [
	'#ffa700',
	'#ff9300',
	'#ff7d00',
	'#ff6500',
	'#ff4600',
	'#c81708',
	'#931b0b',
	'#62190c',
	'#341307',
	'#000000',
]
export default function Thermomètre({ analysis }) {
	const {
		state: { items, scenario },
		dispatch,
	} = useContext(StoreContext)
	const scenarioData = scenarios[scenario],
		{ 'crédit carbone par personne': quota } = scenarioData

	const setNextLimit = () => {
			const next = { C: 'B', B: 'A', A: '0' }[scenario]

			dispatch({
				type: 'SET_SCENARIO',
				scenario: next,
			})
		},
		quota0 = scenarios['C']['crédit carbone par personne']

	return limitReached(analysis, quota) ? (
		<LimitReached setNextLimit={setNextLimit} scenarioData={scenarioData} />
	) : (
		<div css="position: relative">
			<AddButton />

			{!items.length && (
				<p
					css={`
						padding: 0.4rem;
						background: var(--color);
						color: white;
						line-height: 1.5rem;
						position: fixed;
						top: 46%;
						width: 100%;
						text-align: center;
					`}
				>
					Ajoute ce que tu as fait aujourd'hui pour connaître ton impact sur le
					climat {emoji('🌍🌳🐨')}{' '}
				</p>
			)}
			<LimitBar {...{ scenario: scenarios['C'], quota0, analysis }} />
			<LimitBar {...{ scenario: scenarios['B'], quota0, analysis }} />
			{items.length > 0 && (
				<ul
					css={`
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap-reverse;
						position: fixed;
						bottom: 0;
						left: 0;
						width: 100vw;
						margin: 0;
						padding: 0;
						> div > li {
							padding-left: 1rem;
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
						> div {
							display: flex;
						}
						/* This should make it like a snake rather
						 * than returning to the beggining of the line 
						 * for each line break
						 * But of it to work we must add the missing bricks on the line
						> div:nth-child(even) {
							display: flex;
							flex-direction: row-reverse;
							justify-content: flex-end;

						}
						*/
					`}
				>
					{splitEvery(
						blockWidth,
						analysis
							.map((item, i) =>
								Activité({
									item,
									quota0,
									blockWidth,
									quota,
									duplicateItem: () =>
										dispatch({
											type: 'SET_ITEMS',
											items: [
												...items,
												items.find(
													(it) => it.dottedName === item.targets[0].dottedName
												),
											],
										}),
									// animate the last item added only.
									animate: items.length - 1 === i,
									color: colors[i],
								})
							)
							.flat()
					).map((line, i) => (
						<div key={i}>{line}</div>
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
			position: fixed;
			bottom: 1rem;
			right: 1rem;
			z-index: 1;

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

const LimitBar = ({
	scenario: { réchauffement, 'crédit carbone par personne': quota },
	quota0,
	analysis,
}) => {
	const reached = limitReached(analysis, quota0),
		bottom = 100 * (quota / quota0)

	return !reached ? null : (
		<div
			css={`
				position: absolute;
				bottom: ${bottom}vh;
				color: white;
				background: black;
				width: 100%;
				text-align: center;
				padding-left: 0.6rem;
				z-index: 1;
				border: 1px solid white;

				line-height: 1.5rem;
			`}
		>
			Limite pour une planète à {réchauffement}
		</div>
	)
}
