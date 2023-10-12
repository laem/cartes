'use client'
import { questionEcoDimensions } from 'Components/questionEcoDimensions'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import ImpactCard from './ImpactCard'
import { getFoldedSteps } from 'Components/utils/simulationUtils'

const HumanCarbonImpact = ({
	nodeValue,
	formule,
	dottedName,
	engine,
	searchParams,
	objectives,
}) => {
	const rules = engine.getParsedRules(),
		rule = rules[dottedName],
		examplesSource = rule.rawNode.exposé?.['exemples via suggestions'],
		questionEco = rule.rawNode.exposé?.type === 'question éco'

	const situation = useSelector(situationSelector)
	const nextQuestions = useNextQuestions(objectives, engine, searchParams),
		foldedSteps = getFoldedSteps(searchParams, engine.getParsedRules()),
		dirtySituation = Object.keys(situation).find((question) => {
			try {
				return (
					[...nextQuestions, ...foldedSteps].includes(question) &&
					!engine.getRule(question).rawNode.injecté
				)
			} catch (e) {
				return false
			}
		})

	if (!questionEco && (!examplesSource || dirtySituation))
		return <ImpactCard {...{ nodeValue, dottedName }} />

	if (questionEco) {
		const evaluations = questionEcoDimensions.map((unit) =>
			engine.evaluate('lave-linge . ' + unit)
		)
		return (
			<CardList>
				{evaluations.map((evaluation) => (
					<li key={dottedName}>
						<ImpactCard {...{ ...evaluation, questionEco: true }} />
					</li>
				))}
			</CardList>
		)
	}

	const suggestions = rules[examplesSource].suggestions

	const evaluations = Object.entries(suggestions).map(([k, v]) => {
		engine.setSituation({ ...situation, [examplesSource]: v })
		const evaluation = engine.evaluate(dottedName)
		engine.setSituation(situation)
		return { ...evaluation, exampleName: k }
	})

	return (
		<CardList>
			{evaluations.map(({ nodeValue, dottedName, exampleName }) => (
				<li key={exampleName}>
					<ImpactCard {...{ nodeValue, dottedName, exampleName }} />
				</li>
			))}
		</CardList>
	)
}

export default HumanCarbonImpact

const CardList = styled.ul`
	flex-wrap: nowrap;
	overflow-x: auto;
	white-space: nowrap;
	justify-content: normal;
	scrollbar-width: none;
	display: flex;
	list-style-type: none;
	justify-content: start;
	padding: 0;
	height: auto;
	margin-bottom: 0;
	width: calc(100vw - 1.5rem);
	transform: translateX(-1.5rem);
	@media (min-width: 800px) {
		/* TODO */
		width: fit-content;
		position: relative;
		left: calc(50%);
		transform: translateX(-50%);
		overflow: initial;
		justify-content: space-evenly;
	}
	background: white;
	border-radius: 0.3rem;
	li {
		margin: 0 0.1rem;
		padding: 0.2em 0;
	}
`

export const ProgressCircle = ({ engine, searchParams, objectives }) => {
	const nextSteps = useNextQuestions(objectives, engine, searchParams),
		rules = engine.getParsedRules()
	const foldedStepsRaw = getFoldedSteps(searchParams, rules),
		foldedSteps = foldedStepsRaw.filter((step) => !rules[step]?.rawNode.injecté)
	const progress = foldedSteps.length / (nextSteps.length + foldedSteps.length)
	const motionProgress = useMotionValue(0)
	const pathLength = useSpring(motionProgress, { stiffness: 400, damping: 90 })

	useEffect(() => {
		motionProgress.set(progress)
	}, [progress])

	return (
		<svg
			className="progress-icon"
			viewBox="0 0 60 60"
			css="width: 3rem; position: absolute; right: 0; top: .4rem"
		>
			<motion.path
				fill="none"
				strokeWidth="5"
				stroke="var(--color)"
				strokeDasharray="0 1"
				d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
				style={{
					pathLength,
					rotate: 90,
					translateX: 5,
					translateY: 5,
					scaleX: -1, // Reverse direction of line animation
				}}
			/>
			<motion.path
				fill="none"
				strokeWidth="5"
				stroke="var(--color)"
				d="M14,26 L 22,33 L 35,16"
				initial={false}
				strokeDasharray="0 1"
				animate={{ pathLength: progress === 1 ? 1 : 0 }}
			/>
		</svg>
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
