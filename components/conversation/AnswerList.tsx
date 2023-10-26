'use client'
import Emoji from 'Components/Emoji'
import { parentName, safeGetRule } from 'Components/utils/publicodesUtils'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { motion } from 'framer-motion'
import { DottedName } from 'modele-social'
import Link from 'next/link'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	encodeSituation,
	getFoldedSteps,
	getSituation,
} from '../utils/simulationUtils'
import { omit } from '../utils/utils'
import './AnswerList.css'

export default function AnswerList({ searchParams, objectives, engine }) {
	const dispatch = useDispatch()
	const rules = engine.getParsedRules()
	const validatedSituation = getSituation(searchParams, rules)
	const foldedQuestionNames = getFoldedSteps(searchParams, rules)
	const answeredQuestionNames = Object.keys(validatedSituation)
	const [isOpen, setOpen] = useState(false)
	const foldedQuestions = foldedQuestionNames
		.map((dottedName) => {
			const rule = safeGetRule(engine, dottedName)

			const evaluated = rule && engine.evaluate(rule)
			return evaluated
		})
		.filter(Boolean)
	const foldedStepsToDisplay = foldedQuestions
		.map((node) => ({
			...node,
			passedQuestion:
				answeredQuestionNames.find(
					(dottedName) => node.dottedName === dottedName
				) == null,
		}))
		.filter((node) => !JSON.stringify(node).includes('"injecté":"oui"')) // Very strange, should just be rule.rawNode, instead we've got to search for a deeply nested final value, hence the stringified search
	// Engine evaluated multiple times ? TODO

	const nextSteps = useNextQuestions(objectives, engine, searchParams).map(
		(dottedName) => engine.evaluate(engine.getRule(dottedName))
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'c')) return
			console.log('VOILA VOTRE SITUATION')
			console.log(
				JSON.stringify({
					data: { validatedSituation, foldedSteps: foldedQuestionNames },
				})
			)
			/* MARCHE PAS : 
			console.log(
				Object.fromEntries(
					Object.entries(situation).map(([key, value]) => [
						key,
						serializeEvaluation(value),
					])
				)
			)
			*/
			e.preventDefault()
			return false
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [validatedSituation, foldedQuestionNames])

	const answeredQuestionsLength = foldedStepsToDisplay.length,
		nextQuestionsLength = nextSteps.length

	console.log('isOpen', isOpen)
	return (
		<div className="answer-list">
			{!!foldedStepsToDisplay.length && (
				<details
					open={isOpen}
					onClick={(event) => {
						event.preventDefault()
						setOpen(!isOpen)
					}}
					css={`
						font-size: 120%;
						margin-bottom: 0.2rem;
						display: flex;
						align-items: center;

						img {
							margin-right: 0.2rem;
							vertical-align: bottom;
							width: 2rem;
							height: auto;
						}
						button {
							color: white;
						}
						margin: 1rem;
						cursor: pointer;
						summary {
							display: flex;
							justify-content: center;
							align-items: center;
							> * {
								margin: 0 0.2rem;
							}
						}
						> div {
							display: flex;
							flex-direction: column;
							align-items: end;
						}
					`}
				>
					<summary>
						<Emoji e="📋 " />
						<span>
							{answeredQuestionsLength} réponses
							{nextQuestionsLength > 0
								? `, ${nextQuestionsLength} restantes`
								: ''}
						</span>
					</summary>
					<div>
						<Link
							href={{
								query: { _action: 'reset', lu: true },
							}}
							prefetch={false}
							scroll={false}
							onClick={() => {
								dispatch({ type: 'RESET_SIMULATION', objectives })
							}}
							title="Effacer mes réponses"
						>
							<Emoji e="♻️" />
							Effacer
						</Link>

						<StepsTable
							{...{
								rules: foldedStepsToDisplay,
								validatedSituation,
								objectives,
								setOpen,
							}}
						/>
					</div>
				</details>
			)}
			{false && !!nextSteps.length && (
				<div className="ui__ card">
					<h2>
						<Emoji e="🔮 " />
						Prochaines questions
					</h2>
					<CategoryTable {...{ steps: nextSteps, categories }} />
				</div>
			)}
		</div>
	)
}

function StepsTable({
	rules,
	validatedSituation,
	objectives,
	setOpen,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
}) {
	return (
		<table
			css={`
				border: 2px solid var(--darkerColor2);
			`}
		>
			<tbody>
				{rules.map((rule) => (
					<Answer
						key={rule.dottedName}
						{...{
							rule,
							objectives,
							validatedSituation,
							setOpen,
						}}
					/>
				))}
			</tbody>
		</table>
	)
}

const Answer = ({ rule, validatedSituation, objectives, setOpen }) => {
	// Shameless exception, sometimes you've got to do things dirty
	if (
		[
			'transport . avion . départ',
			'transport . avion . arrivée',

			'transport . ferry . départ',
			'transport . ferry . arrivée',

			'voyage . trajet voiture . départ',
			'voyage . trajet voiture . arrivée',
		].includes(rule.dottedName)
	)
		return null

	const path = parentName(rule.dottedName, ' · ', 1)
	const uselessPrefix = objectives[0].includes(path)
	const language = 'fr'

	const trimSituationString = (el) => el && el.split("'")[1]

	const queryWithout = encodeSituation(
		omit([rule.dottedName], validatedSituation)
	)

	if (rule.dottedName === 'transport . avion . distance de vol aller') {
		return (
			<AnswerComponent
				{...{
					queryWithout,
					dottedName: rule.dottedName,
					NameComponent: <div>Votre vol</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['transport . avion . départ']
							)} - ${trimSituationString(
								validatedSituation['transport . avion . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
					setOpen,
				}}
			/>
		)
	}
	if (
		rule.dottedName === 'transport . ferry . distance aller . orthodromique'
	) {
		return (
			<AnswerComponent
				{...{
					queryWithout,
					dottedName: rule.dottedName,
					NameComponent: <div>Votre traversée</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['transport . ferry . départ']
							)} - ${trimSituationString(
								validatedSituation['transport . ferry . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
					setOpen,
				}}
			/>
		)
	}
	if (rule.dottedName === 'voyage . trajet voiture . distance') {
		return (
			<AnswerComponent
				{...{
					queryWithout,
					dottedName: rule.dottedName,
					NameComponent: <div>Votre trajet</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['voyage . trajet voiture . départ']
							)} - ${trimSituationString(
								validatedSituation['voyage . trajet voiture . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
					setOpen,
				}}
			/>
		)
	}

	const NameComponent = (
		<div>
			{path && !uselessPrefix && (
				<div>
					<small>{path}</small>
				</div>
			)}
			<div css="font-size: 110%">{rule.title}</div>
		</div>
	)

	const ValueComponent = (
		<span
			className="answerContent"
			css={`
				${rule.passedQuestion ? 'opacity: .5' : ''}
			`}
		>
			{formatValue(rule, { language })}
			{rule.passedQuestion && (
				<Emoji e={' 🤷🏻'} alt="Je ne sais pas : réponse par défaut" />
			)}
		</span>
	)

	return (
		<AnswerComponent
			{...{
				dottedName: rule.dottedName,
				NameComponent,
				ValueComponent,
				queryWithout,
				setOpen,
			}}
		/>
	)
}

const AnswerComponent = ({
	dottedName,
	NameComponent,
	ValueComponent,
	queryWithout,
	setOpen,
}) => {
	return (
		<motion.tr
			initial={{ opacity: 0, y: -50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.3 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
			key={dottedName}
			css={`
				background: var(--darkestColor);
			`}
		>
			<td>{NameComponent}</td>
			<td>
				<Link
					href={{ query: queryWithout }}
					prefetch={false}
					scroll={false}
					onClick={() => setOpen(false)}
					css={`
						display: inline-block;
						padding: 0.6rem;
						color: inherit;
						font-size: inherit;
						width: 100%;
						text-align: end;
						font-weight: 500;
						> span {
							text-decoration: underline;
							text-decoration-style: dashed;
							text-underline-offset: 4px;
							padding: 0.05em 0em;
							display: inline-block;
						}
					`}
				>
					{ValueComponent}
				</Link>
			</td>
		</motion.tr>
	)
}
