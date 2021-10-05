import { goToQuestion } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import {
	extractCategoriesNamespaces,
	parentName,
	sortCategories,
} from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import './AnswerList.css'

export default function AnswerList() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const foldedQuestionNames = useSelector(answeredQuestionsSelector)
	const answeredQuestionNames = Object.keys(situation)
	const foldedQuestions = foldedQuestionNames.map((dottedName) =>
		engine.evaluate(engine.getRule(dottedName))
	)
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
	const categories = sortCategories(extractCategoriesNamespaces(rules, engine))

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
				<div className="ui__ card">
					<h2>
						{emoji('📋 ')}
						<Trans>Mes réponses</Trans>
					</h2>
					<CategoryTable {...{ steps: foldedStepsToDisplay, categories }} />
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

const CategoryTable = ({ steps, categories }) =>
	categories.map((category) => {
		const categoryRules = steps.filter((question) =>
			question.dottedName.includes(category.dottedName)
		)

		if (!categoryRules.length) return null

		return (
			<div>
				<div
					className="ui__ card"
					css={`
						background: ${category.color} !important;
						display: flex;
						justify-content: start;
						align-items: center;
						img {
							font-size: 300%;
						}
						max-width: 20rem;
						margin: 1rem 0;
						h2 {
							color: white;
							margin: 1rem;
							font-weight: 300;
							text-transform: uppercase;
						}
					`}
				>
					{emoji(category.icons)}
					<h2>{category.title}</h2>
				</div>
				<StepsTable
					{...{
						rules: categoryRules,
						categories,
					}}
				/>
			</div>
		)
	})
function StepsTable({
	rules,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
}) {
	const dispatch = useDispatch()
	const language = useTranslation().i18n.language
	return (
		<table>
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

const Answer = ({ rule, dispatch, language }) => (
	<tr
		key={rule.dottedName}
		css={`
			background: var(--lightestColor);
		`}
	>
		<td>
			<div>
				<small>{parentName(rule.dottedName, ' · ', 1)}</small>
			</div>
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
	</tr>
)
