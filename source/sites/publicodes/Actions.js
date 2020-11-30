import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router'
import { partition, sortBy, union } from 'ramda'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'
import { Switch, Route } from 'react-router-dom'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'
import { Link } from 'react-router-dom'
import { HumanWeight, humanWeight } from './HumanWeight'
import {
	flatRulesSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { setSimulationConfig } from 'Actions/actions'
import Viande from './Viande'
import Action from './Action'
import ActionPlus from './ActionPlus'
import { humanValueAndUnit } from './HumanWeight'
import { encodeRuleName, decodeRuleName, splitName } from 'Engine/rules'

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
		<Switch>
			<Route path="/actions/plus/:encodedName+">
				<ActionPlus />
			</Route>
			<Route path="/actions/:encodedName+">
				<Action />
			</Route>

			<Route path="/actions">
				<AnimatedDiv />
			</Route>
		</Switch>
	)
	if (action) {
		const actionDottedName = decodeRuleName(action)
		return <Action />
	}
}

const AnimatedDiv = animated(({}) => {
	const location = useLocation()

	const rules = useSelector(flatRulesSelector)
	const flatActions = rules.find((r) => r.dottedName === 'actions')

	const simulation = useSelector((state) => state.simulation)

	// Add the actions rules to the simulation, keping the user's situation
	const config = !simulation
		? { objectifs: ['bilan', ...flatActions.formule.somme] }
		: {
				...simulation.config,
				objectifs: union(
					simulation.config.objectifs,
					flatActions.formule.somme
				),
		  }

	const analysis = useSelector(analysisWithDefaultsSelector)

	const configSet = useSelector((state) => state.simulation?.config)
	const foldedSteps = useSelector(
		(state) => state.conversationSteps.foldedSteps
	)

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [location.pathname])
	if (!configSet) return null

	const [bilans, actions] = partition(
		(t) => t.dottedName === 'bilan',
		analysis.targets
	)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<SessionBar />
			{foldedSteps.length === 0 && (
				<p css="line-height: 1.4rem; text-align: center">
					Les chiffres suivants seront alors personnalisés pour votre situation{' '}
					{emoji('🧮')}
				</p>
			)}
			<h1 css="margin: 1rem 0 .6rem;font-size: 160%">
				Comment réduire mon empreinte ?
			</h1>

			{sortBy((a) => -a.nodeValue)(actions).map((action) => (
				<MiniAction
					data={action}
					total={bilans.length ? bilans[0].nodeValue : null}
				/>
			))}
		</div>
	)
})

const MiniAction = ({ data, total }) => {
	const { title, icons, nodeValue, dottedName } = data
	const disabled = nodeValue === 0 || nodeValue === false

	return (
		<Link
			css={`
				${disabled
					? `
					img {
					filter: grayscale(1);
					}
					color: var(--grayColor);
					h2 {
					  color: var(--grayColor);
					}
					opacity: 0.8;`
					: ''}
				text-decoration: none;
				width: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className="ui__ card"
				css={`
					margin: 1rem auto;
					border-radius: 0.6rem;
					padding: 0.6rem;
					display: flex;
					justify-content: start;
					align-items: center;

					text-align: center;
					font-size: 100%;
					h2 {
						font-size: 130%;
						font-weight: normal;
						margin: 1rem 0;
						text-align: left;
					}
					> h2 > span > img {
						margin-right: 0.4rem !important;
					}
				`}
			>
				{icons && (
					<div
						css={`
							font-size: 250%;
							width: 5rem;
							margin-right: 1rem;
							img {
								margin-top: 0.8rem !important;
							}
						`}
					>
						{emoji(icons)}
					</div>
				)}
				<div
					css={`
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-start;
					`}
				>
					<h2>{title}</h2>
					<ActionValue {...{ total, nodeValue }} />
				</div>
			</motion.div>
		</Link>
	)
}

const ActionValue = ({ total, nodeValue }) => {
	const { unit, value } = humanValueAndUnit(nodeValue),
		displayRelative = total
	return (
		<div
			css={`
				> span {
					border-radius: 0.3rem;
					padding: 0.1rem 0.3rem;
				}
				strong {
					font-weight: bold;
				}
				font-size: 120%;
				display: flex;
			`}
		>
			<span
				css={`
					border: 1px solid var(--color);
					background: var(--lighterColor);
					min-width: 8rem;
					margin-right: 0.3rem;
				`}
			>
				{-value} {unit}
				{displayRelative && (
					<div>
						<strong>{Math.round(100 * (nodeValue / total))}%</strong>
					</div>
				)}
			</span>
			<span css="font-size: 80%">
				<div>de CO₂e / an</div>
				{displayRelative && <div>de votre total</div>}
			</span>
		</div>
	)
}
