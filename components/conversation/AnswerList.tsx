'use client'
import Emoji from 'Components/Emoji'
import { parentName, safeGetRule } from 'Components/utils/publicodesUtils'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { motion } from 'framer-motion'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import './AnswerList.css'

export default function AnswerList({ rules, engine }) {
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const foldedQuestionNames = useSelector(answeredQuestionsSelector)
	const answeredQuestionNames = Object.keys(situation)
	const foldedQuestions = foldedQuestionNames
		.map((dottedName) => {
			const rule = safeGetRule(engine, dottedName)

			const evaluated = rule && engine.evaluate(rule)
			if (dottedName.includes('ferry')) console.log('R', evaluated)
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

	const nextSteps = useNextQuestions(engine).map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'c')) return
			console.log('VOILA VOTRE SITUATION')
			console.log(
				JSON.stringify({
					data: { situation, foldedSteps: foldedQuestionNames },
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
	}, [situation])

	return (
		<div className="answer-list">
			{!!foldedStepsToDisplay.length && (
				<div>
					<h2
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
						`}
					>
						<span css="flex-grow:1">
							<Emoji e="📋 " />
							<Trans>Mes réponses</Trans>
						</span>
						<button
							onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
							title="Effacer mes réponses"
						>
							<Emoji e="♻️" />
							Effacer
						</button>
					</h2>
					<StepsTable {...{ rules: foldedStepsToDisplay }} />
				</div>
			)}
			{false && !!nextSteps.length && (
				<div className="ui__ card">
					<h2>
						<Emoji e="🔮 " />
						<Trans>Prochaines questions</Trans>
					</h2>
					<CategoryTable {...{ steps: nextSteps, categories }} />
				</div>
			)}
		</div>
	)
}

function StepsTable({
	rules,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
}) {
	const language = useTranslation().i18n.language
	return (
		<table
			css={`
				border: 2px solid var(--darkerColor2);
			`}
		>
			<tbody>
				{rules.map((rule) => (
					<Answer
						{...{
							rule,
							language,
						}}
					/>
				))}
			</tbody>
		</table>
	)
}

const Answer = ({ rule, language }) => {
	// Shameless exception, sometimes you've got to do things dirty
	if (
		[
			'transport . avion . départ',
			'transport . avion . arrivée',

			'transport . ferry . départ',
			'transport . ferry . arrivée',

			'trajet voiture . départ',
			'trajet voiture . arrivée',
		].includes(rule.dottedName)
	)
		return null

	const path = parentName(rule.dottedName, ' · ', 1)
	const simulationDottedName = useSelector(objectifsSelector)[0]
	const uselessPrefix = simulationDottedName.includes(path)
	const situation = useSelector(situationSelector)

	const trimSituationString = (el) => el && el.split("'")[1]
	if (rule.dottedName === 'transport . avion . distance de vol aller') {
		return (
			<AnswerComponent
				{...{
					dottedName: rule.dottedName,
					NameComponent: <div>Votre vol</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								situation['transport . avion . départ']
							)} - ${trimSituationString(
								situation['transport . avion . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
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
					dottedName: rule.dottedName,
					NameComponent: <div>Votre traversée</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								situation['transport . ferry . départ']
							)} - ${trimSituationString(
								situation['transport . ferry . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
				}}
			/>
		)
	}
	if (rule.dottedName === 'trajet voiture . distance') {
		return (
			<AnswerComponent
				{...{
					dottedName: rule.dottedName,
					NameComponent: <div>Votre trajet</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								situation['trajet voiture . départ']
							)} - ${trimSituationString(
								situation['trajet voiture . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
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
			{...{ dottedName: rule.dottedName, NameComponent, ValueComponent }}
		/>
	)
}

const AnswerComponent = ({ dottedName, NameComponent, ValueComponent }) => {
	const dispatch = useDispatch()
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
				<button
					className="answer"
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
					onClick={() => {
						dispatch({
							type: 'STEP_ACTION',
							name: 'unfold',
							step: dottedName,
						})
					}}
				>
					{ValueComponent}
				</button>
			</td>
		</motion.tr>
	)
}
