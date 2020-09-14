import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'
import { Link } from 'react-router-dom'
import { humanWeight } from './HumanWeight'
import {
	flatRulesSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { setSimulationConfig } from 'Actions/actions'

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	const { score } = useParams()
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: +score,
		from: { value: 0 },
	})

	const analysis = useSelector(analysisWithDefaultsSelector)
	const rules = useSelector(flatRulesSelector)
	const actions = rules.find((r) => r.dottedName === 'actions')
	const config = {
		objectifs: actions.formule.somme,
	}
	const configSet = useSelector((state) => state.simulation?.config)

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [])
	if (!configSet) return null
	console.log(analysis)

	return <AnimatedDiv value={value} score={score} analysis={analysis} />
}

const AnimatedDiv = animated(({ analysis, score, value }) => {
	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<h1 css="margin: 0;font-size: 160%">Comment réduire mon empreinte ?</h1>
			{analysis.targets.map((target) => (
				<Action data={target} />
			))}
		</div>
	)
})

const Action = ({ data }) => {
	const { title, icons, nodeValue, name } = data

	const empreinte = (nodeValue / 1000).toFixed(1) + ' tonne'

	return (
		<Link css="text-decoration: none; width: 100%" to={'/actions/' + name}>
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
						margin: 1rem;
					}
					> h2 > span > img {
						margin-right: 0.4rem !important;
					}
				`}
			>
				<div
					css={`
						font-size: 250%;
						width: 4rem;
						margin-right: 1rem;
						img {
							margin-top: 0.8rem !important;
						}
					`}
				>
					{emoji(icons)}
				</div>
				<div
					css={`
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-start;
					`}
				>
					<h2>{title}</h2>
					<div
						css={`
							background: var(--lighterColor);
							color: var(--color);
							border-radius: 1rem;
							padding: 0.6rem;
							margin-bottom: 0.6rem;
						`}
					>
						<span css="font-size: 200%">- {empreinte}</span> de CO₂e par an
					</div>
				</div>
			</motion.div>
		</Link>
	)
}
