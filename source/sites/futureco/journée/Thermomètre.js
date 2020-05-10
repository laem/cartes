import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import scenarios from '../scenarios.yaml'
import { StoreContext } from '../StoreContext'
import Activité from './Activité'
import LimitReached from './Limit'
import { splitEvery } from 'ramda'
import {
	Objectif1point5,
	Objectif1point5Raté,
	AccordDeParis,
	Soutenable,
	PasSoutenable,
	Objectif2,
	Objectif2Raté,
} from '../jugement'

const computeFootprint = (analysis, items) =>
	analysis.reduce((memo, item) => {
		const itemNode = item.targets[0]
		const count =
			items.find((i) => i.dottedName === itemNode.dottedName).count || 1
		return memo + itemNode.nodeValue * count
	}, 0)

const blockWidth = 10

export const limitReached = (analysis, items, quota) =>
	computeFootprint(analysis, items) > (quota * 1000) / 365
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
		state: { items, scenario, progression },
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

	const dayFootprint = computeFootprint(analysis, items),
		footprint = dayFootprint * 365

	const footprintSoutenable = 2000,
		footprint1point5 = (11000 * (100 - 7)) / 100,
		footprint2 = (11000 * (100 - 4)) / 100

	const {
		done,
		pasSoutenable,
		accordDeParis,
		objectif1point5Raté,
		objectif2Raté,
	} = progression
	if (done)
		return footprintSoutenable ? (
			<Soutenable />
		) : footprint < footprint1point5 ? (
			<Objectif1point5 />
		) : (
			<Objectif2 />
		)
	const update = (k, v) =>
		dispatch({
			type: 'SET_PROGRESSION',
			progression: { ...progression, [k]: v },
		})

	if (footprint > footprintSoutenable && !pasSoutenable)
		return <PasSoutenable next={() => update('pasSoutenable', true)} />
	if (footprint > footprintSoutenable && pasSoutenable && !accordDeParis)
		return <AccordDeParis next={() => update('accordDeParis', true)} />
	if (footprint > footprintSoutenable && accordDeParis) null

	if (footprint > footprint1point5 && !objectif1point5Raté)
		return (
			<Objectif1point5Raté next={() => update('objectif1point5Raté', true)} />
		)

	if (footprint > footprint1point5 && objectif1point5Raté) return null
	if (footprint > footprint2 && !objectif2Raté)
		return <Objectif2Raté next={() => update('objectif2Raté', true)} />

	return (
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
			<LimitBar {...{ items, scenario: scenarios['C'], quota0: 0, analysis }} />
			<LimitBar {...{ items, scenario: scenarios['B'], quota0, analysis }} />
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
							.map((item, i) => {
								const dottedName = item.targets[0].dottedName
								const itemToUpdate = items.find(
									(i) => i.dottedName === dottedName
								)
								const count = itemToUpdate.count || 1
								return Activité({
									item,
									quota0,
									blockWidth,
									quota,
									count,
									changeItemCount: (increment = true) => () =>
										dispatch({
											type: 'SET_ITEMS',
											items: items.map((i) =>
												i.dottedName === dottedName
													? {
															...itemToUpdate,
															count: increment ? count + 1 : count - 1,
													  }
													: i
											),
										}),
									// animate the last item added only.
									animate: items.length - 1 === i,
									color: colors[i],
								})
							})
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
				width: 6rem;
				height: 6rem;
				background: var(--color);
				color: var(--textColor);
				box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
					0 1px 2px rgba(41, 117, 209, 0.24);
				font-size: 300%;
				@media (max-width: 600px) {
					width: 4.5rem;
					height: 4.5rem;
				}
			}
		`}
	>
		<Link to="/journée/ajouter">
			<button>+</button>
		</Link>
	</div>
)

const LimitBar = ({
	scenario: { 'crédit carbone par personne': quota },
	quota0,
	analysis,
	items,
}) => {
	const reached = limitReached(analysis, items, quota0),
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
			Limite pour une journée écolo
		</div>
	)
}
