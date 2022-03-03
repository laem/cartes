import { mapObjIndexed, toPairs } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as chrono from './chrono'
import scenarios from './scenarios.yaml'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import styled from 'styled-components'
import { humanWeight } from './HumanWeight'
import { utils } from 'publicodes'
import Emoji from '../../components/Emoji'
import { useEngine } from '../../components/utils/EngineContext'
const { encodeRuleName } = utils

let limitPerPeriod = (scenario) =>
	mapObjIndexed(
		(v) => v * scenarios[scenario]['crédit carbone par personne'] * 1000,
		{
			...chrono,
			négligeable: 0,
		}
	)

let findPeriod = (scenario, nodeValue) =>
	toPairs(limitPerPeriod(scenario)).find(
		([, limit]) => limit <= Math.abs(nodeValue)
	)

let humanCarbonImpactData = (scenario, nodeValue) => {
	let [closestPeriod, closestPeriodValue] = findPeriod(scenario, nodeValue),
		factor = Math.round(nodeValue / closestPeriodValue),
		closestPeriodLabel = closestPeriod.startsWith('demi')
			? closestPeriod.replace('demi', 'demi-')
			: closestPeriod

	return { closestPeriod, closestPeriodValue, closestPeriodLabel, factor }
}

export default ({ nodeValue, formule, dottedName }) => {
	const rules = useSelector((state) => state.rules),
		rule = rules[dottedName],
		examplesSource = rule.exposé?.['exemples via suggestions']

	console.log(rule.exposé)

	const engine = useEngine()

	if (!examplesSource) return <ImpactCard {...{ nodeValue, dottedName }} />

	const suggestions = rules[examplesSource].suggestions

	const evaluations = Object.entries(suggestions).map(([k, v]) => {
		const situation = { [examplesSource]: v }
		engine.setSituation(situation)
		const evaluation = engine.evaluate(dottedName)
		return evaluation
	})

	return (
		<ul
			css={`
				flex-wrap: nowrap;
				overflow-x: auto;
				white-space: nowrap;
				justify-content: normal;
				scrollbar-width: none;
				display: flex;
				list-style-type: none;
				justify-content: start;
				padding-left: 0px;
				height: auto;
				margin-bottom: 0;
				li {
					border: 3px solid white;
					border-bottom: 4px solid white;
				}
			`}
		>
			{evaluations.map(({ nodeValue, dottedName }) => (
				<li>
					<ImpactCard {...{ nodeValue, dottedName }} />
				</li>
			))}
		</ul>
	)
}

const ImpactCard = ({ nodeValue, dottedName }) => {
	const nextSteps = useNextQuestions()
	const foldedSteps = useSelector((state) => state.simulation?.foldedSteps)
	const scenario = useSelector((state) => state.scenario)
	const [value, unit] = humanWeight(nodeValue)
	let { closestPeriodLabel, closestPeriod, factor } = humanCarbonImpactData(
		scenario,
		nodeValue
	)

	return (
		<div
			css={`
				border-radius: 6px;
				background: var(--color);
				padding: 0.4em;
				margin: 0 auto;
				color: var(--textColor);
			`}
		>
			{closestPeriodLabel === 'négligeable' ? (
				<span>Impact négligeable {emoji('😎')}</span>
			) : (
				<>
					<div
						css={`
							padding: 0.6rem 1rem 0.25rem;
							margin-bottom: 0.25rem;
							color: var(--textColor);
							display: flex;
							flex-direction: column;
							justify-content: space-evenly;
						`}
					>
						<div
							css={`
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 220%;
								img {
									width: 1.6rem;
									margin-left: 0.4rem;
									vertical-align: bottom;
								}
							`}
						>
							<div>
								{factor +
									' ' +
									closestPeriodLabel +
									(closestPeriod[closestPeriod.length - 1] !== 's' &&
									Math.abs(factor) > 1
										? 's'
										: '')}
							</div>
							<Link css="" to="/scénarios">
								<img src={require('Images/yellow-info.svg').default} />
							</Link>
						</div>
						<Link
							css="color: inherit; text-decoration: none"
							to={'/documentation/' + encodeRuleName(dottedName)}
						>
							<p
								css={`
									font-size: 100%;
									margin: 0.3rem 0 0;
									font-style: italic;
									border-radius: 0.4rem;
								`}
							>
								{value} {unit} CO₂e
							</p>
						</Link>
					</div>
				</>
			)}

			{nextSteps?.length > 0 && (
				<FirstEstimationStamp>
					{!foldedSteps.length ? '1ère estimation' : 'estimation'}
				</FirstEstimationStamp>
			)}
		</div>
	)
}

let FirstEstimationStamp = styled.div`
	position: absolute;
	font-size: 100%;
	font-weight: 600;
	display: inline-block;
	padding: 0rem 1rem;
	text-transform: uppercase;
	border-radius: 1rem;
	font-family: 'Courier';
	mix-blend-mode: lighten;
	color: lightgrey;
	border: 0.15rem solid lightgrey;
	-webkit-mask-position: 13rem 6rem;
	-webkit-transform: rotate(-16deg);
	-ms-transform: rotate(-16deg);
	transform: rotate(-7deg);
	border-radius: 4px;
	top: 13em;
	right: -3em;
`
