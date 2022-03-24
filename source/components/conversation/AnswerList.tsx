import { goToQuestion } from 'Actions/actions'
import {
	extractCategoriesNamespaces,
	parentName,
	sortCategories,
} from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { situationSelector } from 'Selectors/simulationSelectors'
import {
	answeredQuestionsSelector,
	objectifsSelector,
} from '../../selectors/simulationSelectors'
import { splitName, safeGetRule } from '../publicodesUtils'
import Emoji from 'Components/Emoji'
import './AnswerList.css'
import { resetSimulation } from '../../actions/actions'
import { motion } from 'framer-motion'

export default function AnswerList() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const foldedQuestionNames = useSelector(answeredQuestionsSelector)
	const answeredQuestionNames = Object.keys(situation)
	const foldedQuestions = foldedQuestionNames
		.map((dottedName) => {
			const rule = safeGetRule(engine, dottedName)

			return rule && engine.evaluate(rule)
		})
		.filter(Boolean)
	const foldedStepsToDisplay = foldedQuestions.map((node) => ({
		...node,
		passedQuestion:
			answeredQuestionNames.find(
				(dottedName) => node.dottedName === dottedName
			) == null,
	}))

	const nextSteps = useNextQuestions().map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)
	const rules = useSelector((state) => state.rules)

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
							{emoji('📋 ')}
							<Trans>Mes réponses</Trans>
						</span>
						<button
							onClick={() => dispatch(resetSimulation())}
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
						{emoji('🔮 ')}
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
	const dispatch = useDispatch()
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
							dispatch,
							language,
						}}
					/>
				))}
			</tbody>
		</table>
	)
}

const Answer = ({ rule, dispatch, language }) => {
	const history = useHistory()
	const path = parentName(rule.dottedName, ' · ', 1)
	const simulationDottedName = useSelector(objectifsSelector)[0]
	const uselessPrefix = simulationDottedName.includes(path)

	return (
		<motion.tr
			initial={{ opacity: 0, y: -50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.3 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
			key={rule.dottedName}
			css={`
				background: var(--darkestColor);
			`}
		>
			<td>
				{path && !uselessPrefix && (
					<div>
						<small>{path}</small>
					</div>
				)}
				<div css="font-size: 110%">{rule.title}</div>
			</td>
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
						dispatch(goToQuestion(rule.dottedName))
					}}
				>
					<span
						className="answerContent"
						css={`
							${rule.passedQuestion ? 'opacity: .5' : ''}
						`}
					>
						{formatValue(rule, { language })}
						{rule.passedQuestion && emoji(' 🤷🏻')}
					</span>
				</button>
			</td>
		</motion.tr>
	)
}
